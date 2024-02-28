import { BaseResponse } from "../../web-layer/models/response/BaseResponse";
import { CognitoSSOUser } from "../../service-layer/models/CognitoSSOUser";
import { User } from "../../service-layer/models/User";

export interface IAuthService {
    register(user: User): Promise<User>;
    getUserByEmail(email: string): Promise<User>;
    getAWSConfig(): Promise<BaseResponse>;
    getCognitoUserByEmail(email: string): Promise<CognitoSSOUser>;
}