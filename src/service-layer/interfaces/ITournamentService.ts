import { BaseResponse } from "../../web-layer/models/response/BaseResponse";

export interface ITournamentService {
    getTournamentById(id : string): Promise<BaseResponse>;
}