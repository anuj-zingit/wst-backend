export interface IBookingDBManager {
    getTicketsByEventId(eventId : number, dataParams : any): Promise<any>;
    getTaxes(): Promise<any>;
    bookings(userId : number, dataParams : any): Promise<any>;
    bookTicket(userId : number, dataParams : any): Promise<any>;
    cancelTicket(userId : number, dataParams : any): Promise<any>;
    getBookedTicketData(eventId : number, dataParams : any): Promise<any>;
}