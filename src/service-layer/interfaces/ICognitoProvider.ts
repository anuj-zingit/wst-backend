import { BaseResponse } from "../../web-layer/models/response/BaseResponse";
import { CognitoSSOUser } from "../../service-layer/models/CognitoSSOUser";

export interface ICognitoProvider {
    registerCognitoUser(user: CognitoSSOUser): Promise<CognitoSSOUser>;
    login(user: CognitoSSOUser): Promise<CognitoSSOUser>;
    forgotpassword(user: CognitoSSOUser): Promise<CognitoSSOUser>;
    updatePassword(user: CognitoSSOUser, code: string): Promise<CognitoSSOUser>;
    changePassword(user: CognitoSSOUser, newPassword: string): Promise<CognitoSSOUser>;
    logout(user: CognitoSSOUser): Promise<CognitoSSOUser>;
    validateToken(token: string): Promise<any>;
}