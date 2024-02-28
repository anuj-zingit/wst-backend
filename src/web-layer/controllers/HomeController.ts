import { Body, Get, JsonController, Post, QueryParam, Req, Res } from "routing-controllers";
import { ServiceFactory } from "../../service-layer/ServiceFactory";
import { UserRequest } from "../models/request/UserRequest";
import { IHomeService } from "../../service-layer/interfaces/IHomeService";
import { IUserService } from "../../service-layer/interfaces/IUserService";
import { UserLocation } from "service-layer/models/UserLocation";
import { Jwt } from "../../middleware/Jwt";

@JsonController()
export class HomeController {
    private readonly homeService: IHomeService;
    private readonly userService: IUserService;
    private readonly jwtService: Jwt;

    constructor() {
        this.homeService = ServiceFactory.getHomeService();
        this.userService = ServiceFactory.getUserService();
        this.jwtService = new Jwt();
    }

    @Get("/homeCards")
    public async homeCards(@Req() req: any,@Res() res: any): Promise<any> {
        let [validToken, decodedToken] = await this.jwtService.validateToken(req);
        if (!validToken) {
            return res.status(401).json({message :  "Invalid Token"});
        }
        const profile: any = await this.userService.getProfile(decodedToken.userData.id);
        let categoryIds = [];
        if(profile && profile.settings){
            categoryIds = profile.settings['categories'] || [];
        }
        const categories: any = await this.homeService.getCategories(null);
        const location: UserLocation = await this.userService.getSelectedLocation(decodedToken.userData.id);
        const selectedSportsEvents: any = await this.homeService.getEvents(decodedToken.userData.id, { categoryIds }); // tournaments = events
        const events: any = await this.homeService.getEvents(decodedToken.userData.id, null); // tournaments = events
        const cites: any = await this.homeService.getCities(null);

        return {
            selectedLocation : location,
            selectedSportEvents: selectedSportsEvents,
            topCategories : categories,
            topCities : cites,
            sports : categories,
            upComingEvents: events,
        }
    }

    @Get("/categories")
    public async categories(@Req() req: any, @Res() res: any): Promise<any> {
        // let [validToken, decodedToken] = await this.jwtService.validateToken(req);
        // if (!validToken) {
        //     return res.status(401).json({message :  "Invalid Token"});
        // }
        const categories = await this.homeService.getCategories(req.query);
        return categories;
    }

    @Get("/cities")
    public async cities(@Req() req: any, @Res() res: any): Promise<any> {
        let [validToken, decodedToken] = await this.jwtService.validateToken(req);
        if (!validToken) {
            return res.status(401).json({message :  "Invalid Token"});
        }
        const categories: any = await this.homeService.getCities(req.query);
        return categories;
    }

    @Get("/tournaments")
    public async events(@Req() req: any, @Res() res: any): Promise<any> {
        let [validToken, decodedToken] = await this.jwtService.validateToken(req);
        if (!validToken) {
            return res.status(401).json({message :  "Invalid Token"});
        }
        const events: any = await this.homeService.getEvents(decodedToken.userData.id, req.query);
        return events;
    }

    @Get("/tournamentDetails")
    public async tournamentDetails(@Req() req: any, @QueryParam("id") id: number, @Res() res: any): Promise<any> {
        try{
            let [validToken, decodedToken] = await this.jwtService.validateToken(req);
            if (!validToken) {
                return res.status(401).json({message :  "Invalid Token"});
            }
            let event: any = await this.homeService.getEventDetails(decodedToken.userData.id, id);
            if(event && event.length){
                event = event[0];
    
                //save in recent search
                await this.userService.saveSearch(decodedToken.userData.id, id);
    
                //similars items based on category
                event.similars = await this.homeService.getEvents(decodedToken.userData.id, { categoryIds : [event.category_id], notIds : [event.id] });
    
            }
            return event;
        }
        catch(err){
            console.log({err})
            throw new Error(JSON.stringify(err) );
        }
    }

    @Post("/organizor/tournaments")
    public async organizorTournaments(@Body() req: any): Promise<any> {
        // let [validToken, decodedToken] = await this.jwtService.validateToken(req);
        // if (!validToken) {
        //     return res.status(401).json({message :  "Invalid Token"});
        // }
        const events: any = await this.homeService.getOrganizorTournaments(req.userId, req.search, req.pageNumber, req.limit);
        const groupedData = events.reduce((acc, item) => {
            const category = item.lable;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(item);
            return acc;
        }, {});

        let dataToSend = [];
        for(let key in groupedData){
            dataToSend.push({
                lable: key,
                events: groupedData[key]
            })
        }

        return dataToSend;
    }

}