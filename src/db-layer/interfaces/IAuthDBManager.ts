import { User } from "../../service-layer/models/User";
import { BaseResponse } from "../../web-layer/models/response/BaseResponse";

export interface IAuthDBManager {
    register(user: User): Promise<User>;
    getUserByEmail(email: string): Promise<User>;
    getAWSConfig(): Promise<BaseResponse>;
}