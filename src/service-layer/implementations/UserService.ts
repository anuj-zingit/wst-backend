import { User } from "../models/User";
import { DBManagerFactory } from "../../db-layer/DataAccessLayerFactory";
import { IUserDBManager } from "../../db-layer/interfaces/IUserDBManager";
import { IUserService } from "../interfaces/IUserService";
import { UserLocation } from "../models/UserLocation";
import { UserSearch } from "../models/UserSearch";
import { UserFavourite } from "../models/UserFavourite";
import { PlayerRequest } from "../../web-layer/models/request/PlayerRequest";

export class UserService implements IUserService {
    private readonly userDBManager: IUserDBManager;

    constructor() {
        this.userDBManager = DBManagerFactory.getUserDBManager();
    }

    public async saveLocation(userId : number, userLocation: UserLocation): Promise<UserLocation> {
        return await this.userDBManager.saveLocation(userId, userLocation);
    }

    public async getLocations(userId : number): Promise<UserLocation> {
        return await this.userDBManager.getLocations(userId);
    }

    public async getSelectedLocation(userId : number): Promise<UserLocation> {
        return await this.userDBManager.getSelectedLocation(userId);
    }

    public async saveSelectedLocation(userId : number, locationId: number): Promise<UserLocation> {
        return await this.userDBManager.saveSelectedLocation(userId, locationId);
    }

    public async updateProfile(userId : number, userProfile: User): Promise<UserLocation> {
        return await this.userDBManager.updateProfile(userId, userProfile);
    }

    public async getProfile(userId: number): Promise<UserLocation> {
        return await this.userDBManager.getProfile(userId);
    }

    public async getSearches(userId : number): Promise<UserSearch> {
        return await this.userDBManager.getSearches(userId);
    }

    public async saveSearch(userId: number, eventId: number): Promise<UserSearch> {
        return await this.userDBManager.saveSearch(userId, eventId);
    }

    public async getFavouriteTournaments(userId: number): Promise<UserFavourite> {
        return await this.userDBManager.getFavouriteTournaments(userId);
    }

    public async saveFavouriteTournament(userId: number, eventId: number): Promise<UserFavourite> {
        return await this.userDBManager.saveFavouriteTournament(userId, eventId);
    }

    public async saveSelectedCategories(userId: number, categories: Array<number>): Promise<any> {
        return await this.userDBManager.saveSelectedCategories(userId, categories);
    }

    public async getParticipatedTournaments(userId: number, dataParams : any): Promise<UserFavourite> {
        return await this.userDBManager.getParticipatedTournaments(userId, dataParams);
    }

    public async getParticipatedAchievements(userId: number, dataParams : any): Promise<UserFavourite> {
        return await this.userDBManager.getParticipatedAchievements(userId, dataParams);
    }

    public async getNotifications(userId: number, dataParams : any): Promise<UserFavourite> {
        return await this.userDBManager.getNotifications(userId, dataParams);
    }

    public async getNotificationCount(userId: number, dataParams : any): Promise<UserFavourite> {
        return await this.userDBManager.getNotificationCount(userId, dataParams);
    }

    public async list(params: PlayerRequest): Promise<User[]> {
        return await this.userDBManager.list(params);
    }

    public async getPlayersCreativesList(params: PlayerRequest): Promise<any> {
        return await this.userDBManager.getPlayersCreativesList(params);
    }
}