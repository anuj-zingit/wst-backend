import { BaseResponse } from "../../web-layer/models/response/BaseResponse";
export interface IHomeService {
    getCategories(dataParams : any): Promise<any>;
    getCities(dataParams:any): Promise<any>;
    getEvents(userId: number, dataParams : any): Promise<any>;
    getEventDetails(userId: number, eventId: number,): Promise<any>;
    getOrganizorTournaments(userId: number, search : string, pageNumber: number, limit: number): Promise<BaseResponse>;
}