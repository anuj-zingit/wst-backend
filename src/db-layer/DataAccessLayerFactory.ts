import { IAuthDBManager } from "./interfaces/IAuthDBManager";
import { ICognitoDBManager } from "./interfaces/ICognitoDBManager";
import { IHomeDBManager } from "./interfaces/IHomeDBManager";
import { IUserDBManager } from "./interfaces/IUserDBManager";
import { IBookingDBManager } from "./interfaces/IBookingDBManager";
import { ICreativeDBManager } from "./interfaces/ICreativeDBManager";
import { ITournamentDBManager } from "./interfaces/ITournamentDBManager";



export class DBManagerFactory {
    private static authDBManager: IAuthDBManager;
    private static cognitoDBManager: ICognitoDBManager;
    private static homeDBManager: IHomeDBManager;
    private static userDBManager: IUserDBManager;
    private static bookingDBManager: IBookingDBManager;
    private static creativeDBManager: ICreativeDBManager;
    private static tournamentDBManager: ITournamentDBManager;

    public static getTournamentDBManager(): ITournamentDBManager {
        return this.tournamentDBManager;
    }

    public static setTournamentDBManager(tournamentDBManager: ITournamentDBManager): void {
        this.tournamentDBManager = tournamentDBManager;
    }

    public static getCreativeDBManager(): ICreativeDBManager {
        return this.creativeDBManager;
    }

    public static setCreativeDBManager(creativeDBManager: ICreativeDBManager): void {
        this.creativeDBManager = creativeDBManager;
    }

    public static getCognitoDBManager(): ICognitoDBManager {
        return this.cognitoDBManager;
    }

    public static setCognitoDBManager(cognitoDBManager: ICognitoDBManager): void {
        this.cognitoDBManager = cognitoDBManager;
    }

    public static getAuthDBManager(): IAuthDBManager {
        return this.authDBManager;
    }

    public static setAuthDBManager(authDBManager: IAuthDBManager): void {
        this.authDBManager = authDBManager;
    }

    public static getHomeDBManager(): IHomeDBManager {
        return this.homeDBManager;
    }

    public static setHomeDBManager(homeDBManager: IHomeDBManager): void {
        this.homeDBManager = homeDBManager;
    }

    public static getUserDBManager(): IUserDBManager {
        return this.userDBManager;
    }

    public static setUserDBManager(userDBManager: IUserDBManager): void {
        this.userDBManager = userDBManager;
    }

    public static getBookingDBManager(): IBookingDBManager {
        return this.bookingDBManager;
    }

    public static setBookingDBManager(bookingDBManager: IBookingDBManager): void {
        this.bookingDBManager = bookingDBManager;
    }
}