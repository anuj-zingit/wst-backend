import { BaseResponse } from "../../web-layer/models/response/BaseResponse";

export interface ITournamentDBManager {
    getTournamentById(id : string): Promise<BaseResponse>;
}