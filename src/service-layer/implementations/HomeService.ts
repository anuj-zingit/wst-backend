import { DBManagerFactory } from "../../db-layer/DataAccessLayerFactory";
import { IHomeDBManager } from "../../db-layer/interfaces/IHomeDBManager";
import { IHomeService } from "../interfaces/IHomeService";
import { BaseResponse } from "../../web-layer/models/response/BaseResponse";

export class HomeService implements IHomeService {
    private readonly homeDBManager: IHomeDBManager;

    constructor() {
        this.homeDBManager = DBManagerFactory.getHomeDBManager();
    }

    public async getCategories(dataParams : any): Promise<any> {
        return await this.homeDBManager.getCategories(dataParams);
    }

    public async getCities(dataParams:any): Promise<any> {
        return await this.homeDBManager.getCities(dataParams);
    }

    public async getEvents(userId: number, dataParams : any): Promise<any> {
        return await this.homeDBManager.getEvents(userId, dataParams);
    }

    public async getEventDetails(userId: number, eventId: number): Promise<any> {
        return await this.homeDBManager.getEventDetails(userId, eventId);
    }

    public async getOrganizorTournaments(userId: number, search : string, pageNumber: number, limit: number): Promise<BaseResponse> {
        let params: any = {};
        params.pageNumber = pageNumber;
        params.search = search;
        params.limit = limit;
        return await this.homeDBManager.getOrganizorTournaments(userId, params);
    }

}