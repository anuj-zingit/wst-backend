import { Creative } from "../../service-layer/models/Creative";

export interface ICreativeDBManager {
    getCreative(creative: Creative): Promise<Creative>;
    saveCreative(creative: Creative): Promise<Creative>;
    templatesByCategoryId(categoryId: number): Promise<any>;
    getCreatives(userId: string, tournamentId: string): Promise<any>;
}