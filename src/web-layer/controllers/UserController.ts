import { Body, Get, JsonController, Post, QueryParam, Req, Res } from "routing-controllers";
import { IHomeService } from "../../service-layer/interfaces/IHomeService";
import { IUserService } from "../../service-layer/interfaces/IUserService";
import { ServiceFactory } from "../../service-layer/ServiceFactory";
import { UserLocation } from "service-layer/models/UserLocation";
import { User } from "service-layer/models/User";
import { Utility } from "../../utils/Utility";
import { Jwt } from "../../middleware/Jwt";
import { PlayerRequest } from "../../web-layer/models/request/PlayerRequest";
import { IEmailService } from "../../service-layer/interfaces/IEmailService";

@JsonController()
export class UserController {
    private readonly homeService: IHomeService;
    private readonly userService: IUserService;
    private readonly emailService: IEmailService;
    private readonly jwtService: Jwt;
    constructor() {
        this.userService = ServiceFactory.getUserService();
        this.homeService = ServiceFactory.getHomeService();
        this.emailService = ServiceFactory.getEmailService();
        this.jwtService = new Jwt();
    }

    @Post("/saveLocation")
    public async saveLocation(@Req() req: any,@Res() res: any): Promise<any> {
        let [validToken, decodedToken] = await this.jwtService.validateToken(req);
        if (!validToken) {
            return res.status(401).json({message :  "Invalid Token"});
        }
        const userLocation: UserLocation = Utility.getUserLocation(req.body);
        const location: any = await this.userService.saveLocation(decodedToken.userData.id, userLocation);
        return location
    }

    @Get("/locations")
    public async location(@Req() req: any,@Res() res: any): Promise<any> {
        let [validToken, decodedToken] = await this.jwtService.validateToken(req);
        if (!validToken) {
            return res.status(401).json({message :  "Invalid Token"});
        }
        const locations: any = await this.userService.getLocations(decodedToken.userData.id);
        return locations
    }

    @Post("/saveSelectedLocation")
    public async saveSelectedLocation(@Req() req, @Res() res: any): Promise<any> {
        let [validToken, decodedToken] = await this.jwtService.validateToken(req);
        if (!validToken) {
            return res.status(401).json({message :  "Invalid Token"});
        }
        if(!req.body.locationId){
            return res.status(400).json({message :  "Invalid locationId"});
        }
        const location: any = await this.userService.saveSelectedLocation(decodedToken.userData.id, req.body.locationId);
        return location
    }

    @Post("/updateProfile")
    public async updateProfile(@Req() req: any, @Res() res: any): Promise<any> {
        let [validToken, decodedToken] = await this.jwtService.validateToken(req);
        if (!validToken) {
            return res.status(401).json({message :  "Invalid Token"});
        }
        if(!req.body.email){
            return res.status(400).json({message :  "Invalid email"});
        }
        if(!req.body.name){
            return res.status(400).json({message :  "Invalid name"});
        }
        const userProfile: User = Utility.getUserProfile(req.body);
        const profile: any = await this.userService.updateProfile(decodedToken.userData.id, userProfile);
        return profile
    }

    @Get("/profile")
    public async profile(@Req() req: any, @Res() res: any): Promise<any> {
        let [validToken, decodedToken] = await this.jwtService.validateToken(req);
        if (!validToken) {
            return res.status(401).json({message :  "Invalid Token"});
        }
        const profile: any = await this.userService.getProfile(decodedToken.userData.id);
        let participatedTournaments = await this.userService.getParticipatedTournaments(decodedToken.userData.id, null);
        let participatedAchievements = await this.userService.getParticipatedAchievements(decodedToken.userData.id, null);
        
        return {
            profile,
            tournaments: {
                participatedTournaments: {
                    count: participatedTournaments.length,
                    list: participatedTournaments
                },
                achievements: {
                    count: participatedAchievements.length,
                    list: participatedAchievements
                }
            },
        }
    }

    @Get("/recentSearch")
    public async recentSearch(@Req() req: any, @Res() res: any): Promise<any> {
        let [validToken, decodedToken] = await this.jwtService.validateToken(req);
        if (!validToken) {
            return res.status(401).json({message :  "Invalid Token"});
        }
        let seachIds: any = await this.userService.getSearches(decodedToken.userData.id);
        // Extract only the IDs
        seachIds = seachIds.map(item => item.eventId);
        let data=[];
        if(seachIds && seachIds.length){
            req.query.ids = seachIds;
            data = await this.homeService.getEvents(decodedToken.userData.id, req.query );
        }
        return data
    }

    @Post("/saveFavouriteTournament")
    public async saveFavouriteTournament(@Req() req, @Res() res: any): Promise<any> {
        let [validToken, decodedToken] = await this.jwtService.validateToken(req);
        if (!validToken) {
            return res.status(401).json({message :  "Invalid Token"});
        }
        if(!req.body.eventId){
            return res.status(400).json({message :  "Invalid eventId"});
        }
        const data: any = await this.userService.saveFavouriteTournament(decodedToken.userData.id, req.body.eventId);
        return data
    }

    @Get("/favouriteTournaments")
    public async favouriteTournaments(@Req() req: any, @Res() res: any): Promise<any> {
        let [validToken, decodedToken] = await this.jwtService.validateToken(req);
        if (!validToken) {
            return res.status(401).json({message :  "Invalid Token"});
        }
        let favouriteTournamentsIds: any = await this.userService.getFavouriteTournaments(decodedToken.userData.id);
        favouriteTournamentsIds = favouriteTournamentsIds.map(item => item.eventId);
        let data=[];
        if(favouriteTournamentsIds && favouriteTournamentsIds.length){
            req.query.ids = favouriteTournamentsIds;
            data = await this.homeService.getEvents(decodedToken.userData.id, req.query);
        }
        return data
    }

    @Post("/saveSelectedCategories")
    public async saveSelectedCategories(@Req() req, @Res() res: any): Promise<any> {
        let [validToken, decodedToken] = await this.jwtService.validateToken(req);
        if (!validToken) {
            return res.status(401).json({message :  "Invalid Token"});
        }
        if(!(req.body.categories && req.body.categories.length)){
            return res.status(400).json({message :  "Invalid category"});
        }
        const profile: any = await this.userService.saveSelectedCategories(decodedToken.userData.id, req.body.categories);
        return profile
    }

    @Get("/participatedTournaments")
    public async participatedTournaments(@Req() req: any, @Res() res: any): Promise<any> {
        let [validToken, decodedToken] = await this.jwtService.validateToken(req);
        if (!validToken) {
            return res.status(401).json({message :  "Invalid Token"});
        }
        const data: any = await this.userService.getParticipatedTournaments(decodedToken.userData.id, req.query);
        return data;
    }

    @Get("/participatedAchievements")
    public async participatedAchievements(@Req() req: any, @Res() res: any): Promise<any> {
        let [validToken, decodedToken] = await this.jwtService.validateToken(req);
        if (!validToken) {
            return res.status(401).json({message :  "Invalid Token"});
        }
        const data: any = await this.userService.getParticipatedAchievements(decodedToken.userData.id, req.query);
        return data;
    }

    @Get("/notificationCount")
    public async notificationCount(@Req() req: any, @Res() res: any): Promise<any> {
        let [validToken, decodedToken] = await this.jwtService.validateToken(req);
        if (!validToken) {
            return res.status(401).json({message :  "Invalid Token"});
        }
        let data: any = await this.userService.getNotificationCount(decodedToken.userData.id, req.query);
        if(data && data.length){
            data = data[0];
        }
        return data;
    }

    @Get("/notifications")
    public async notifications(@Req() req: any, @Res() res: any): Promise<any> {
        let [validToken, decodedToken] = await this.jwtService.validateToken(req);
        if (!validToken) {
            return res.status(401).json({message :  "Invalid Token"});
        }
        const data: any = await this.userService.getNotifications(decodedToken.userData.id, req.query);
        return data;
    }

    @Post("/players/list")
    public async list(@Body() req: PlayerRequest): Promise<User[]> {
        return await this.userService.list(req);
    }

    @Post("/sendEmailtoUsers")
    public async sendEmailtoUsers(@Body() req: any): Promise<any> {
        // If allPlayers true then get list of all players from DB else get playersId array
        if(req.allPlayers) {
            const users: any = await this.userService.getPlayersCreativesList(req);
            await this.emailService.sendEmail(users);
            return users;
        }
        return await this.userService.list(req);
    }

}