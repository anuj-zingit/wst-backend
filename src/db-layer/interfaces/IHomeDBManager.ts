export interface IHomeDBManager {
    getCategories(dataParams:any): Promise<any>;
    getCities(dataParams:any): Promise<any>;
    getEvents(userId: number, dataParams:any): Promise<any>;
    getEventDetails(userId: number, eventId: number,): Promise<any>;
    getOrganizorTournaments(userId: number, dataParams:any): Promise<any>;
}