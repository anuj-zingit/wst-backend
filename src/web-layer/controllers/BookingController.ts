import { Body, Get, JsonController, Post, QueryParam, Req, Res } from "routing-controllers";
import { ServiceFactory } from "../../service-layer/ServiceFactory";
import { IBookingService } from "../../service-layer/interfaces/IBookingService";
import { Jwt } from "../../middleware/Jwt";
import { Constants } from "../../utils/Constants";

@JsonController()
export class BookingController {
    private readonly bookingService: IBookingService;
    private readonly jwtService: Jwt;
    constructor() {
        this.bookingService = ServiceFactory.getBookingService();
        this.jwtService = new Jwt();
    }

    @Get("/tickets")
    public async categories(@Req() req: any, @QueryParam("eventId") eventId: number, @Res() res: any): Promise<any> {
        let [validToken, decodedToken] = await this.jwtService.validateToken(req);
        if (!validToken) {
            return res.status(401).json({message :  "Invalid Token"});
        }
        const tickets: any = await this.bookingService.getTicketsByEventId(eventId);
        return tickets;
    }

    @Get("/bookings")
    public async bookings(@Req() req: any, @Res() res: any): Promise<any> {
        let [validToken, decodedToken] = await this.jwtService.validateToken(req);
        if (!validToken) {
            return res.status(401).json({message :  "Invalid Token"});
        }
        const bookings: any = await this.bookingService.bookings(decodedToken.userData.id, req.query);
        return bookings;
    }

    @Post("/checkBookingTicketAvailable")
    public async checkBookingTicketAvailable(@Req() req: any, @Res() res: any): Promise<any> {
        try{
            let [validToken, decodedToken] = await this.jwtService.validateToken(req);
            if (!validToken) {
                return res.status(401).json({message :  "Invalid Token"});
            }
            if(!req.body.eventId){
                return res.status(400).json({message :  "Invalid eventId"});
            }
            if(!(req.body.tickets && req.body.tickets.length)){
                return res.status(400).json({message :  "Invalid tickets"});
            }
            if(!req.body.bookingDate){
                return res.status(400).json({message :  "Invalid bookingDate"});
            }
            if(!req.body.startTime){
                return res.status(400).json({message :  "Invalid startTime"});
            }
            if(![Constants.PAYMENT_METHODS.OFFLINE,Constants.PAYMENT_METHODS.ONLINE].includes(req.body.paymentMethod)){
                return res.status(400).json({message :  "Invalid paymentMethod"});
            }
            req.body.userData = decodedToken.userData;
            const bookings: any = await this.bookingService.bookTicket(decodedToken.userData.id, req.body);
            return bookings;
        } catch (err) {
            console.log({err})
            throw new Error(err);
        }
    }

    @Post("/bookTicket")
    public async bookTicket(@Req() req: any, @Res() res: any): Promise<any> {
        try{
            let [validToken, decodedToken] = await this.jwtService.validateToken(req);
            if (!validToken) {
                return res.status(401).json({message :  "Invalid Token"});
            }
            if(!req.body.eventId){
                return res.status(400).json({message :  "Invalid eventId"});
            }
            if(!(req.body.tickets && req.body.tickets.length)){
                return res.status(400).json({message :  "Invalid tickets"});
            }
            if(!req.body.bookingDate){
                return res.status(400).json({message :  "Invalid bookingDate"});
            }
            if(!req.body.startTime){
                return res.status(400).json({message :  "Invalid startTime"});
            }
            if(![Constants.PAYMENT_METHODS.OFFLINE,Constants.PAYMENT_METHODS.ONLINE].includes(req.body.paymentMethod)){
                return res.status(400).json({message :  "Invalid paymentMethod"});
            }

            if(req.body.paymentMethod == Constants.PAYMENT_METHODS.ONLINE){
                if(!req.body.amountPaid){
                    return res.status(400).json({message :  "Invalid amountPaid"});
                }
                if(!req.body.paymentId){
                    return res.status(400).json({message :  "Invalid paymentId"});
                }
                if(!req.body.paymentOrderId){
                    return res.status(400).json({message :  "Invalid paymentOrderId"});
                }
                if(!req.body.paymentSignature){
                    return res.status(400).json({message :  "Invalid paymentSignature"});
                }
                if(!req.body.paymentStatus){
                    return res.status(400).json({message :  "Invalid paymentStatus"});
                }
            }

            req.body.userData = decodedToken.userData;
            req.body.orderPlace = 1;  //place order
            const bookings: any = await this.bookingService.bookTicket(decodedToken.userData.id, req.body);
            return bookings;
        } catch (err) {
            console.log({err})
            throw new Error(err);
        }
    }

    @Post("/cancelTicket")
    public async cancelTicket(@Req() req: any, @Res() res: any): Promise<any> {
        let [validToken, decodedToken] = await this.jwtService.validateToken(req);
        if (!validToken) {
            return res.status(401).json({message :  "Invalid Token"});
        }
        if(!req.body.eventId){
            return res.status(400).json({message :  "Invalid eventId"});
        }

        if(!req.body.ticketId){
            return res.status(400).json({message :  "Invalid bookingId"});
        }

        if(!req.body.bookingId){
            return res.status(400).json({message :  "Invalid bookingId"});
        }
        
        const bookings: any = await this.bookingService.cancelTicket(decodedToken.userData.id, req.body);
        return bookings;
    }

    @Post("/downloadTicket")
    public async downloadTicket(@Req() req: any, @Res() res: any): Promise<any> {
        let [validToken, decodedToken] = await this.jwtService.validateToken(req);
        if (!validToken) {
            return res.status(401).json({message :  "Invalid Token"});
        }

        if(!req.body.eventId){
            return res.status(400).json({message :  "Invalid eventId"});
        }
        
        if(!req.body.ticketId){
            return res.status(400).json({message :  "Invalid bookingId"});
        }

        if(!req.body.bookingId){
            return res.status(400).json({message :  "Invalid bookingId"});
        }
        const bookings: any = await this.bookingService.downloadTicket(decodedToken.userData.id, req.body);
        return bookings;
    }

}