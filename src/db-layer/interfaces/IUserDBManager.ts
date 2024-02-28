import { UserLocation } from "../../service-layer/models/UserLocation";
import { User } from "../../service-layer/models/User";
import { UserSearch } from "../../service-layer/models/UserSearch";
import { UserFavourite } from "../../service-layer/models/UserFavourite";
import { PlayerRequest } from "../../web-layer/models/request/PlayerRequest";
export interface IUserDBManager {
    saveLocation(userId : number, userLocation: UserLocation): Promise<UserLocation>;
    getLocations(userId : number): Promise<UserLocation>;
    getSelectedLocation(userId : number): Promise<UserLocation>;
    saveSelectedLocation(userId : number, locationId: number): Promise<UserLocation>;
    getProfile(userId: number): Promise<any>;
    updateProfile(userId : number, userProfile: User): Promise<any>;
    getSearches(userId : number): Promise<UserSearch>;
    saveSearch(userId: number, eventId: number): Promise<UserSearch>;
    getFavouriteTournaments(userId: number): Promise<UserFavourite>;
    saveFavouriteTournament(userId: number, eventId: number): Promise<UserFavourite>;
    saveSelectedCategories(userId : number, categories: Array<number>): Promise<any>;
    getParticipatedTournaments(userId : number, dataParams : any): Promise<any>;
    getParticipatedAchievements(userId : number, dataParams : any): Promise<any>;
    getNotificationCount(userId : number, dataParams : any): Promise<any>;
    getNotifications(userId : number, dataParams : any): Promise<any>;

    //TMS
    list(params: PlayerRequest): Promise<User[]>;
    getPlayersCreativesList(params: PlayerRequest): Promise<any>;

}