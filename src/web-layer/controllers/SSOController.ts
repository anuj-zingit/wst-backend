import { Body, Get, JsonController, Post, QueryParam, Req, Res } from "routing-controllers";
import { ServiceFactory } from "../../service-layer/ServiceFactory";
import { ISSOService } from "../../service-layer/interfaces/ISSOService";
import { CognitoSSOUser } from "../../service-layer/models/CognitoSSOUser";

@JsonController()
export class SSOController {
    private readonly ssoService: ISSOService;
    constructor() {
        this.ssoService = ServiceFactory.getSSOService();
    }

    @Get("/validateToken")
    public async validateToken(@QueryParam("token") token: string): Promise<any> {
        console.log("validateToken "+token);
        const response: any = await this.ssoService.validateToken(token);
        if(typeof(response) !== 'object' && response.toLowerCase().includes("invalid")) {
            return { "success": 0, "message": "Invalid Token" };
        }
        const user = await this.ssoService.getUserByToken(token);
        return { "success": 1, "response": user };

    }

    @Get("/getToken")
    public async getToken(@QueryParam("username") username: string, @QueryParam("password") password: string): Promise<CognitoSSOUser> {
        return await this.ssoService.getToken(username, password);
    }
}