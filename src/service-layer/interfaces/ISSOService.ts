import { CognitoSSOUser } from "../../service-layer/models/CognitoSSOUser";
import { BaseResponse } from "../../web-layer/models/response/BaseResponse";

export interface ISSOService {
    validateToken(token : string): Promise<BaseResponse>;
    getToken(username: string, password: string): Promise<CognitoSSOUser>;
    getUserByToken(token: string): Promise<CognitoSSOUser>;
}