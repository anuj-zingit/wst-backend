import { execute } from "./MySQLDBManager";
import { IHomeDBManager } from "../interfaces/IHomeDBManager";
import { UserLocation } from "../../service-layer/models/UserLocation";
import { Utility } from "../../utils/Utility";

export class HomeDBManager implements IHomeDBManager {

    constructor() { }

    public async getCategories(dataParams : any): Promise<any> {
        try {
            let query = `SELECT id, name, slug, thumb FROM categories WHERE 1=1`;
            let params = [];
            if(dataParams){
                if(dataParams.search){
                    query += ` AND (name like "%${dataParams.search}%" OR slug like "%${dataParams.search}%") `
                }
                if(dataParams.ids && dataParams.ids.length){
                    query += ` AND id in (?)`;
                    params.push(dataParams.ids)
                }
            }

            const result = await execute(query, params);
            return result;
        } catch (err) {
            throw new Error(err);
        }
    }

    public async getCities(dataParams : any): Promise<any> {
        try {
            let query = `SELECT id, title, description, images FROM venues WHERE 1=1`;
            let params = [];
            if(dataParams){
                if(dataParams.search){
                    query += ` AND (title like "%${dataParams.search}%" OR description like "%${dataParams.search}%") `
                }
                if(dataParams.ids && dataParams.ids.length){
                    query += ` AND id in (?)`;
                    params.push(dataParams.ids)
                }
            }

            const result = await execute(query, params);
            return result;
        } catch (err) {
            throw new Error(err);
        }
    }

    public async getEvents(userId: number, dataParams : any): Promise<any> {
        try {
            let query = `SELECT events.id, events.title, events.description, events.thumbnail, events.images, events.category_id, start_date, end_date, start_time, end_time, address, city, categories.name as  event_category, if(user_favourite.id, 1, 0) as isFavourite, DATE_FORMAT(start_date, "%c %Y") as lable 
                FROM events 
                LEFT JOIN categories ON categories.id = events.category_id
                LEFT JOIN user_favourite ON user_favourite.eventId = events.id AND user_favourite.userId = ?
                WHERE publish=1
            `;
            let params = [userId];

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
            query += ` ORDER BY featured desc LIMIT ?,?`;
            const result = await execute(query, params);
            return result;
        } catch (err) {
            throw new Error(err);
        }
    }

    public async getEventDetails(userId: number, eventId: number): Promise<any> {
        try {
            let query = `SELECT events.*, if(user_favourite.id, 1, 0) as isFavourite, categories.name as  event_category 
                FROM events 
                LEFT JOIN categories ON categories.id = events.category_id
                LEFT JOIN user_favourite ON user_favourite.eventId = events.id AND user_favourite.userId = ?
                WHERE publish=1 AND events.id=?
            `;
            let params = [userId, eventId];
            const result = await execute(query, params);
            return result;
        } catch (err) {
            throw new Error(err);
        }
    }

    public async getOrganizorTournaments(userId: number, dataParams : any): Promise<any> {
        try {
            let query = `SELECT events.id, events.title, events.description, events.thumbnail, events.images, events.category_id, start_date, end_date, start_time, end_time, address, city, categories.name as  event_category, DATE_FORMAT(start_date, "%m-%Y") as lable 
            FROM events 
            LEFT JOIN categories ON categories.id = events.category_id
            WHERE start_date is not null AND events.user_id = ${userId}`;

            let params = [];

            let skip = 0;
            let limit = 100;

            if(dataParams){
                if(dataParams.search){
                    query += ` AND (title LIKE "%${dataParams.search}%" OR description LIKE "%${dataParams.search}%") `
                }
                // if(dataParams.categoryIds && dataParams.categoryIds.length){
                //     query += ` AND category_id IN (?)`;
                //     params.push(dataParams.categoryIds)
                // }
                // if(dataParams.categoryId){
                //     query += ` AND category_id = ?`;
                //     params.push(dataParams.categoryId)
                // }
                // if(dataParams.priceType){
                //     query += ` AND price_type = ?`;
                //     params.push(dataParams.priceType)
                // }
                // if(dataParams.countryId){
                //     query += ` AND country_id = ?`;
                //     params.push(dataParams.countryId)
                // }            
                
                // if(dataParams.ids && dataParams.ids.length){
                //     query += ` AND events.id in (?)`;
                //     params.push(dataParams.ids)
                // }
                // if(dataParams.id){
                //     query += ` AND events.id = ? `;
                //     params.push(dataParams.id)
                // }
                // if(dataParams.notIds && dataParams.notIds.length){
                //     query += ` AND events.id NOT IN (?)`;
                //     params.push(dataParams.notIds)
                // }
                // if(dataParams.upComing == 1){
                //     query += ` AND start_date > CURDATE()`;
                // }
                if(dataParams.limit){
                    limit = parseInt(dataParams.limit)
                }
                if(dataParams.pageNumber){
                    skip = parseInt(dataParams.pageNumber) * limit;
                }
            }

            params.push(skip,limit)
            query += `  ORDER BY lable desc;`;
            const result = await execute(query, params);
            console.log({result})
            return result;
        } catch (err) {
            throw new Error(err);
        }
    }
}