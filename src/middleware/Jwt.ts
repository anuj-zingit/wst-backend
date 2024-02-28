import { ServiceFactory } from "../service-layer/ServiceFactory";
import { ICognitoProvider } from "../service-layer/interfaces/ICognitoProvider";
import { IAuthService } from "../service-layer/interfaces/IAuthService";
import { User } from "../service-layer/models/User";
import { DBManagerFactory } from "../db-layer/DataAccessLayerFactory";


export class Jwt {
    private readonly cognitoProvider: ICognitoProvider;
    private readonly authService: IAuthService;
    constructor() {
        this.cognitoProvider = ServiceFactory.getCognitoProvider();
        this.authService = ServiceFactory.getAuthService();
    }
    
    public async validateToken(req, accessTokenSecret=null) {
        const authHeader = req.headers['authorization'];
        if (!authHeader) return [false,false];
        // console.log(authHeader);
        const token = authHeader.split(' ')[1];
        // let response = await this.cognitoProvider.validateToken(token);
        let response: any = {};                                
        response.userData = await DBManagerFactory.getCognitoDBManager().getCognitoUserByToken(token);
        if(response && response.userData){
            const user: User = await this.authService.getUserByEmail(response.userData.email);
            response.userData = user;
            response = [true,response];
        }
        else{
            response= [false,false];
        }
        return response
      };


}   