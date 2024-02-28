import { CognitoSSOUser } from "../../service-layer/models/CognitoSSOUser";
import { DBManagerFactory } from "../../db-layer/DataAccessLayerFactory";
import { ICognitoDBManager } from "../../db-layer/interfaces/ICognitoDBManager";
import { ServiceFactory } from "../../service-layer/ServiceFactory";
import { ICognitoProvider } from "../../service-layer/interfaces/ICognitoProvider";
import { ISSOService } from "../../service-layer/interfaces/ISSOService";
import { BaseResponse } from "../../web-layer/models/response/BaseResponse";

export class SSOService implements ISSOService {
    private readonly cognitoDBManager: ICognitoDBManager;
    private readonly cognitoProvider: ICognitoProvider;

    constructor() {
        this.cognitoProvider = ServiceFactory.getCognitoProvider();
        this.cognitoDBManager = DBManagerFactory.getCognitoDBManager();
    }

    public async validateToken(token: string): Promise<BaseResponse> {
        return await this.cognitoProvider.validateToken(token);
    }

    public async getToken(username: string, password: string): Promise<CognitoSSOUser> {
        return await this.cognitoDBManager.getTokenByUsername(username, password);
    }

    public async getUserByToken(token: string): Promise<CognitoSSOUser> {
        return await this.cognitoDBManager.getUserByToken(token);
    }
}