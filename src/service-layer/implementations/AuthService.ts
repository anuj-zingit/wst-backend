import { User } from "../../service-layer/models/User";
import { DBManagerFactory } from "../../db-layer/DataAccessLayerFactory";
import { IAuthDBManager } from "../../db-layer/interfaces/IAuthDBManager";
import { IAuthService } from "../../service-layer/interfaces/IAuthService";
import { CognitoSSOUser } from "../../service-layer/models/CognitoSSOUser";
import { ICognitoDBManager } from "../../db-layer/interfaces/ICognitoDBManager";
import { BaseResponse } from "../../web-layer/models/response/BaseResponse";

export class AuthService implements IAuthService {
    private readonly authDBManager: IAuthDBManager;
    private readonly cognitoDBManager: ICognitoDBManager;

    constructor() {
        this.authDBManager = DBManagerFactory.getAuthDBManager();
        this.cognitoDBManager = DBManagerFactory.getCognitoDBManager();
    }
    
    public async register(user: User): Promise<User> {
        return await this.authDBManager.register(user);
    }

    public async getUserByEmail(email: string): Promise<User> {
        return await this.authDBManager.getUserByEmail(email);
    }

    public async getCognitoUserByEmail(email: string): Promise<CognitoSSOUser> {
        return await this.cognitoDBManager.getCognitoUserByEmail(email);
    }

    public async getAWSConfig(): Promise<BaseResponse> {
        return await this.authDBManager.getAWSConfig();
    }
}