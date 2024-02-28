import { IAuthService } from "./interfaces/IAuthService";
import { ICognitoProvider } from "./interfaces/ICognitoProvider";
import { IHomeService } from "./interfaces/IHomeService";
import { IUserService } from "./interfaces/IUserService";
import { IBookingService } from "./interfaces/IBookingService";
import { ISSOService } from "./interfaces/ISSOService";
import { ICreativeService } from "./interfaces/ICreativeService";
import { ITournamentService } from "./interfaces/ITournamentService";
import { IWSTProvider } from "./interfaces/IWSTProvider";
import { IEmailService } from "./interfaces/IEmailService";

export class ServiceFactory {
    private static authService: IAuthService;
    private static cognitoProvider: ICognitoProvider;
    private static homeService: IHomeService;
    private static userService: IUserService;
    private static bookingService: IBookingService;
    private static ssoService: ISSOService;
    private static creativeService: ICreativeService;
    private static tournamentService: ITournamentService;
    private static wstProvider: IWSTProvider;
    private static emailService: IEmailService;

    public static getEmailService(): IEmailService {
        return this.emailService;
    }

    public static setEmailService(emailService: IEmailService): void {
        this.emailService = emailService;
    }

    public static getWSTProvider(): IWSTProvider {
        return this.wstProvider;
    }

    public static setWSTProvider(wstProvider: IWSTProvider): void {
        this.wstProvider = wstProvider;
    }

    public static getCreativeService(): ICreativeService {
        return this.creativeService;
    }

    public static setCreativeService(creativeService: ICreativeService): void {
        this.creativeService = creativeService;
    }

    public static getSSOService(): ISSOService {
        return this.ssoService;
    }

    public static setSSOService(ssoService: ISSOService): void {
        this.ssoService = ssoService;
    }

    public static getCognitoProvider(): ICognitoProvider {
        return this.cognitoProvider;
    }

    public static setCognitoProvider(cognitoProvider: ICognitoProvider): void {
        this.cognitoProvider = cognitoProvider;
    }

    public static getAuthService(): IAuthService {
        return this.authService;
    }

    public static setAuthService(authService: IAuthService): void {
        this.authService = authService;
    }

    public static getHomeService(): IHomeService {
        return this.homeService;
    }

    public static setHomeService(homeService: IHomeService): void {
        this.homeService = homeService;
    }

    public static getUserService(): IUserService {
        return this.userService;
    }

    public static setUserService(userService: IUserService): void {
        this.userService = userService;
    }

    public static getBookingService(): IBookingService {
        return this.bookingService;
    }

    public static setBookingService(bookingService: IBookingService): void {
        this.bookingService = bookingService;
    }

    public static getTournamentService(): ITournamentService {
        return this.tournamentService;
    }

    public static setTournamentService(tournamentService: ITournamentService): void {
        this.tournamentService = tournamentService;
    }
}