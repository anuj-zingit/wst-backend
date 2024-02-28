import { Creative } from "../../service-layer/models/Creative";

export interface ICreativeService {
    saveCreative(creative: Creative): Promise<Creative>;
    getCreative(creative: Creative): Promise<Creative>;
    generate(id: string, uniqueUUID: string): Promise<any>;
    templatesByCategoryId(categoryId: number): Promise<any>;
    getCreatives(userId: string, tournamentId: string): Promise<any>;
}