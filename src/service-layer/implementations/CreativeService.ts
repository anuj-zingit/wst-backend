import { ICreativeService } from "../../service-layer/interfaces/ICreativeService";
import { DBManagerFactory } from "../../db-layer/DataAccessLayerFactory";
import { Creative } from "../../service-layer/models/Creative";
import { ICreativeDBManager } from "../../db-layer/interfaces/ICreativeDBManager";
import { IWSTProvider } from "../../service-layer/interfaces/IWSTProvider";
import { ServiceFactory } from "../../service-layer/ServiceFactory";

export class CreativeService implements ICreativeService {
    private readonly creativeDBManager: ICreativeDBManager;
    private readonly wstProvider: IWSTProvider;

    constructor() {
        this.creativeDBManager = DBManagerFactory.getCreativeDBManager();
        this.wstProvider = ServiceFactory.getWSTProvider();
    }

    public async saveCreative(creative: Creative): Promise<Creative> {
        return await this.creativeDBManager.saveCreative(creative);
    }

    public async getCreative(creative: Creative): Promise<Creative> {
        return await this.creativeDBManager.getCreative(creative);
    }

    public async generate(id: string, uniqueUUID: string): Promise<any> {
        return await this.wstProvider.generate(id, uniqueUUID);
    }
    
    public async templatesByCategoryId(categoryId: number): Promise<any> {
        return await this.creativeDBManager.templatesByCategoryId(categoryId);
    }

    public async getCreatives(userId: string, tournamentId: string): Promise<any> {
        return await this.creativeDBManager.getCreatives(userId, tournamentId);
    }
}