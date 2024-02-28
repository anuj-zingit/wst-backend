export interface IBookingService {
    getTicketsByEventId(eventId : number): Promise<any>;
    bookings(userId : number, dataParams : any): Promise<any>;
    bookTicket(userId : number, dataParams : any): Promise<any>;
    cancelTicket(userId : number, dataParams : any): Promise<any>;
    downloadTicket(userId : number, dataParams : any): Promise<any>;
}