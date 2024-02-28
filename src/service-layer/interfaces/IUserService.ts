import { UserLocation } from "../models/UserLocation";
import { UserSearch } from "../models/UserSearch";
import { User } from "../models/User";
import { UserFavourite } from "../models/UserFavourite";
import { PlayerRequest } from "../../web-layer/models/request/PlayerRequest";
export interface IUserService {
    saveLocation(userId : number, userLocation: UserLocation): Promise<UserLocation>;
    getLocations(userId : number): Promise<UserLocation>;
    getSelectedLocation(userId : number): Promise<UserLocation>;
    saveSelectedLocation(userId : number, locationId : number): Promise<UserLocation>;
    updateProfile(userId : number, user: User): Promise<any>;
    getProfile(userId : number): Promise<any>;
    getSearches(userId : number): Promise<UserSearch>;
    saveSearch(userId : number, eventId : number): Promise<UserSearch>;
    saveFavouriteTournament(userId : number, eventId : number): Promise<UserFavourite>;
    getFavouriteTournaments(userId : number): Promise<UserFavourite>;
    saveSelectedCategories(userId : number, categories: Array<number>): Promise<any>;
    getParticipatedTournaments(userId : number, dataParams : any): Promise<any>;
    getParticipatedAchievements(userId : number, dataParams : any): Promise<any>;
    getNotificationCount(userId : number, dataParams : any): Promise<any>;
    getNotifications(userId : number, dataParams : any): Promise<any>;

    //TMS
    list(params: PlayerRequest): Promise<User[]>;
    getPlayersCreativesList(params: PlayerRequest): Promise<any>;

}