import { execute } from "./MySQLDBManager";
import { IUserDBManager } from "../interfaces/IUserDBManager";
import { UserLocation } from "../../service-layer/models/UserLocation";
import { User } from "../../service-layer/models/User";
import { UserSearch } from "../../service-layer/models/UserSearch";
import { UserFavourite } from "../../service-layer/models/UserFavourite";
import { PlayerRequest } from "../../web-layer/models/request/PlayerRequest";

export class UserDBManager implements IUserDBManager {

    constructor() { }

    public async saveLocation(userId : number, userLocation: UserLocation): Promise<UserLocation> {
        try {
            const query: string = 'INSERT INTO user_location (userId, address, latitude, longitude, city) VALUES (?, ?, ?, ?, ?)';
            let data: any = await execute(query, [userId, userLocation.getAddress(), userLocation.getLatitude(), userLocation.getLongitude(), userLocation.getCity()]);
            if(data){
                await execute(`UPDATE user_location SET isDefault=? WHERE userId=? AND id <> ?`, [0, userId, data.insertId])
            }
            return data
        } catch (err) {
            throw new Error(err);
        }
    }

    public async getLocations(userId : number): Promise<UserLocation> {
        try {
            const result: UserLocation = await execute("SELECT * FROM user_location where userId=? order by id desc", [userId]);
            return result ;
        } catch (err) {
            throw new Error(err);
        }
    }

    public async getSelectedLocation(userId : number): Promise<UserLocation> {
        try {
            const result: UserLocation = await execute("SELECT * FROM user_location where userId=? and isDefault=1", [userId]);
            return result && result[0] ? result[0] : null;
        } catch (err) {
            throw new Error(err);
        }
    }

    public async saveSelectedLocation(userId : number, locationId: number): Promise<UserLocation> {
        try {
            await execute(`UPDATE user_location SET isDefault=? WHERE userId=?`, [0, userId]);
            return await execute(`UPDATE user_location SET isDefault=? WHERE userId=? AND id = ?`, [1, userId, locationId]);
        } catch (err) {
            throw new Error(err);
        }
    }

    public async updateProfile(userId : number, userProfile: User): Promise<any> {
        try {
            let isEmailExist: any = await execute(`SELECT id from users WHERE email=? AND id <> ?`, 
                [userProfile.getEmail(), userId]
            );
            if(isEmailExist && isEmailExist.length){
                return { message : 'Email already exist', isError : 1 }
            }
            await execute(`UPDATE users SET name=?, phone=?, address=? WHERE id = ?`, 
                [userProfile.getName(), userProfile.getPhone(), userProfile.getAddress(), userId]
            );
            return { message : 'Profile updated successfully', isError : 0 }

        } catch (err) {
            throw new Error(err);
        }
    }

    public async getProfile(userId: number): Promise<any> {
        try {
            const result: UserLocation = await execute(`SELECT id, name, email, avatar, phone, address, settings, created_at, updated_at FROM users where id=?`, [userId]);
            if(result && result[0]){
                result[0].settings = JSON.parse(result[0].settings)
                return result[0]
            }
            return null;
        } catch (err) {
            throw new Error(err);
        }
    }

    public async getSearches(userId : number): Promise<UserSearch> {
        try {
            const result: UserSearch = await execute("SELECT eventId FROM user_search where userId=? order by id desc", [userId]);
            return result ;
        } catch (err) {
            throw new Error(err);
        }
    }

    public async saveSearch(userId: number, eventId: number): Promise<UserSearch> {
        try {
            const  isExist: any = await execute(`SELECT id from user_search WHERE userId=? AND eventId=?`, 
                [userId, eventId]
            );
            if(isExist && isExist.length){
                await execute("SET SQL_SAFE_UPDATES = 0;",[]);
                await execute(`UPDATE user_search SET created_at=current_timestamp(), updated_at=current_timestamp() WHERE userId=? AND eventId=?`, 
                [userId, eventId]
                );                
                await execute("SET SQL_SAFE_UPDATES = 1;",[]);
                return isExist;
            }
            const  data: any = await execute(`INSERT INTO user_search (userId, eventId) VALUES (?, ?)`, 
                [userId, eventId]
            );
            return data
        } catch (err) {
            throw new Error(err);
        }
    }

    public async getFavouriteTournaments(userId : number): Promise<UserFavourite> {
        try {
            const result: UserFavourite = await execute("SELECT eventId FROM user_favourite where userId=? order by id desc", [userId]);
            return result ;
        } catch (err) {
            throw new Error(err);
        }
    }

    public async saveFavouriteTournament(userId: number, eventId: number): Promise<UserFavourite> {
        try {
            let isExist: any = await execute(`SELECT id from user_favourite WHERE userId=? AND eventId=?`, 
                [userId, eventId]
            );
            if(isExist && isExist.length){
                await execute("SET SQL_SAFE_UPDATES = 0;",[]);
                await execute(`DELETE FROM user_favourite WHERE userId=? AND eventId=?`, 
                    [userId, eventId]
                );              
                await execute("SET SQL_SAFE_UPDATES = 1;",[]);
                return isExist;
            }
            let data: any = await execute(`INSERT INTO user_favourite (userId, eventId) VALUES (?, ?)`, 
                [userId, eventId]
            );
            return data
        } catch (err) {
            throw new Error(err);
        }
    }

    public async saveSelectedCategories(userId: number, categories: Array<number>): Promise<any> {
        try {
            let isExist: any = await execute(`SELECT settings from users WHERE id=?`, 
                [userId]
            );
            if(!(isExist && isExist.length)){
                return { message : 'User not exist', isError : 1 }
            }
            let settings = isExist[0].settings ? {...JSON.parse(isExist[0].settings), ...{ categories : categories} } : { categories : categories }
            await execute(`UPDATE users SET settings=? WHERE id = ?`, 
                [JSON.stringify(settings), userId]
            );
            return { message : 'Sports updated successfully', isError : 0 }

        } catch (err) {
            throw new Error(err);
        }
    }

    public async getParticipatedTournaments(userId: number, dataParams : any): Promise<any> {
        try {
            let query = `SELECT events.id, events.title, events.thumbnail, events.images, events.category_id,if(user_favourite.id, 1, 0) as isFavourite  
                FROM bookings 
                LEFT JOIN events ON events.id = bookings.event_id
                LEFT JOIN user_favourite ON user_favourite.eventId = events.id AND user_favourite.userId = ?
                WHERE bookings.customer_id=?
            `;
            let params = [userId, userId];

            let skip = 0;
            let limit = 10;

            if(dataParams){
                if(dataParams.search){
                    query += ` AND (title LIKE "%${dataParams.search}%" OR description LIKE "%${dataParams.search}%") `
                }
                if(dataParams.categoryIds && dataParams.categoryIds.length){
                    query += ` AND category_id IN (?)`;
                    params.push(dataParams.categoryIds)
                }
                if(dataParams.categoryId){
                    query += ` AND category_id = ?`;
                    params.push(dataParams.categoryId)
                }
                if(dataParams.priceType){
                    query += ` AND price_type = ?`;
                    params.push(dataParams.priceType)
                }
                if(dataParams.countryId){
                    query += ` AND country_id = ?`;
                    params.push(dataParams.countryId)
                }            
                
                if(dataParams.ids && dataParams.ids.length){
                    query += ` AND events.id in (?)`;
                    params.push(dataParams.ids)
                }
                if(dataParams.id){
                    query += ` AND events.id = ? `;
                    params.push(dataParams.id)
                }
                if(dataParams.notIds && dataParams.notIds.length){
                    query += ` AND events.id NOT IN (?)`;
                    params.push(dataParams.notIds)
                }
                if(dataParams.upComing == 1){
                    query += ` AND start_date > CURDATE()`;
                }
                if(dataParams.limit){
                    limit = parseInt(dataParams.limit)
                }
                if(dataParams.pageNumber){
                    skip = parseInt(dataParams.pageNumber) * limit;
                }
            }

            params.push(skip,limit)
            query += ` ORDER BY bookings.created_at desc LIMIT ?,?`;
            
            const result: any = await execute(query, params);
            return result;
        } catch (err) {
            throw new Error(err);
        }
    }

    public async getParticipatedAchievements(userId: number, dataParams : any): Promise<any> {
        try {
            let query = `SELECT events.id, events.title, events.thumbnail, events.images, events.category_id,if(user_favourite.id, 1, 0) as isFavourite  
                FROM bookings 
                LEFT JOIN events ON events.id = bookings.event_id
                LEFT JOIN user_favourite ON user_favourite.eventId = events.id AND user_favourite.userId = ?
                WHERE bookings.customer_id=? AND bookings.certificate_flag=?
            `;
            let params = [userId, userId, 1];

            let skip = 0;
            let limit = 10;

            if(dataParams){
                if(dataParams.search){
                    query += ` AND (title LIKE "%${dataParams.search}%" OR description LIKE "%${dataParams.search}%") `
                }
                if(dataParams.categoryIds && dataParams.categoryIds.length){
                    query += ` AND category_id IN (?)`;
                    params.push(dataParams.categoryIds)
                }
                if(dataParams.categoryId){
                    query += ` AND category_id = ?`;
                    params.push(dataParams.categoryId)
                }
                if(dataParams.priceType){
                    query += ` AND price_type = ?`;
                    params.push(dataParams.priceType)
                }
                if(dataParams.countryId){
                    query += ` AND country_id = ?`;
                    params.push(dataParams.countryId)
                }            
                
                if(dataParams.ids && dataParams.ids.length){
                    query += ` AND events.id in (?)`;
                    params.push(dataParams.ids)
                }
                if(dataParams.id){
                    query += ` AND events.id = ? `;
                    params.push(dataParams.id)
                }
                if(dataParams.notIds && dataParams.notIds.length){
                    query += ` AND events.id NOT IN (?)`;
                    params.push(dataParams.notIds)
                }
                if(dataParams.upComing == 1){
                    query += ` AND start_date > CURDATE()`;
                }
                if(dataParams.limit){
                    limit = parseInt(dataParams.limit)
                }
                if(dataParams.pageNumber){
                    skip = parseInt(dataParams.pageNumber) * limit;
                }
            }

            params.push(skip,limit)
            query += ` ORDER BY bookings.created_at desc LIMIT ?,?`;
            
            const result: any = await execute(query, params);
            return result;
        } catch (err) {
            throw new Error(err);
        }
    }

    public async getNotificationCount(userId: number, dataParams : any): Promise<any> {
        try {
            let query = `SELECT count(id) as count  
                FROM notifications 
                WHERE notifications.notifiable_id=?
            `;
            let params = [userId];

            // let skip = 0;
            // let limit = 10;

            // params.push(skip,limit)
            // query += ` ORDER BY notifications.created_at desc LIMIT ?,?`;
            
            const result: any = await execute(query, params);
            return result;
        } catch (err) {
            throw new Error(err);
        }
    }
    
    public async getNotifications(userId: number, dataParams : any): Promise<any> {
        try {
            let query = `SELECT *  
                FROM notifications 
                WHERE notifications.notifiable_id=?
            `;
            let params = [userId];

            let skip = 0;
            let limit = 10;

            params.push(skip,limit)
            query += ` ORDER BY notifications.created_at desc LIMIT ?,?`;
            
            const result: any = await execute(query, params);
            return result;
        } catch (err) {
            throw new Error(err);
        }
    }

    public async list(req: PlayerRequest): Promise<User[]> {
        try {
            let query = `SELECT * FROM tmsdatabase.users LEFT JOIN bookings ON bookings.customer_id = users.id where bookings.event_id = ${req.tournamentId} AND bookings.organiser_id = ${req.organiserId}`;
            // query += ` ORDER BY users.created_at desc LIMIT ${req.limit},${req.skip}`;
            if(req.search){
                query = `SELECT * FROM tmsdatabase.users LEFT JOIN bookings ON bookings.customer_id = users.id where bookings.event_id = ${req.tournamentId} AND bookings.organiser_id = ${req.organiserId} AND (users.name LIKE '%${req.search}%' OR users.email LIKE '%${req.search}%')`;
            }
            const result: any = await execute(query, []);
            return result;
        } catch (err) {
            throw new Error(err);
        }
    }

    public async getPlayersCreativesList(req: PlayerRequest): Promise<any> {
        try {
            let query = `SELECT * FROM tmsdatabase.creative_mapping INNER JOIN users ON creative_mapping.user_id = users.id INNER JOIN bookings ON bookings.customer_id = users.id where bookings.event_id = ${req.tournamentId} AND bookings.organiser_id = ${req.organiserId} ;`            ;
            const result: any = await execute(query, []);
            return result;
        } catch (err) {
            throw new Error(err);
        }
    }

}