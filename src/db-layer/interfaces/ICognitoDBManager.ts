import { CognitoSSOUser } from "../../service-layer/models/CognitoSSOUser";

export interface ICognitoDBManager {
    getCognitoUserByEmail(email: string): Promise<CognitoSSOUser>;
    registerCognitoUser(user: CognitoSSOUser): Promise<CognitoSSOUser>;
    updateToken(token: string, user: CognitoSSOUser): Promise<string>;
    getTokenByUsername(username: string, password: string): Promise<CognitoSSOUser>;
    getUserByToken(token: string): Promise<CognitoSSOUser>;
    updatePassword(user: CognitoSSOUser): Promise<any>;
    deleteCognitoUser(user: CognitoSSOUser): Promise<CognitoSSOUser>;
    getCognitoUserByToken(token: string): Promise<CognitoSSOUser>;
}