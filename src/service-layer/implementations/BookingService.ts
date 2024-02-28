import { User } from "../models/User";
import { DBManagerFactory } from "../../db-layer/DataAccessLayerFactory";
import { IBookingDBManager } from "../../db-layer/interfaces/IBookingDBManager";
import { IHomeDBManager } from "../../db-layer/interfaces/IHomeDBManager";
import { IUserDBManager } from "../../db-layer/interfaces/IUserDBManager";
import { IBookingService } from "../interfaces/IBookingService";
import * as moment from "moment";
import { Utility } from "../../utils/Utility";
import { Constants } from "../../utils/Constants";
import * as fs from "fs";
import * as qrcode from "qrcode";
import * as html_to_pdf from "html-pdf-node";
let downloadTicketHtmlContent = Constants.DOWNLOAD_TICKET_HTML_CONTENT
let adminSettings = {
    taxes: [],
    adminCommission: 5, //admin commision on organizer
    maxTicketLimit: 2, //max ticket user can book
    preCancellationTime: '3' // in hrs
}



export class BookingService implements IBookingService {
    private readonly bookingDBManager: IBookingDBManager;
    private readonly homeDBManager: IHomeDBManager;
    private readonly userDBManager: IUserDBManager;

    constructor() {
        this.bookingDBManager = DBManagerFactory.getBookingDBManager();
        this.homeDBManager = DBManagerFactory.getHomeDBManager();
        this.userDBManager = DBManagerFactory.getUserDBManager();
    }

    public async getTicketsByEventId(eventId: number): Promise<any> {
        return await this.bookingDBManager.getTicketsByEventId(eventId, null);
    }

    public async bookings(userId: number, requestParams: any): Promise<any> {
        return await this.bookingDBManager.bookings(userId, requestParams);
    }

    public async bookTicket(userId: number, requestParams: any): Promise<any> {
        try {

            const customer = await this.userDBManager.getProfile(userId)
            if (!customer) {
                return {
                    status: false,
                    error: 'user not found'
                };
            }

            let taxes = await this.bookingDBManager.getTaxes();
            adminSettings.taxes = taxes;
            console.log({ adminSettings })

            // get event details
            let event = await this.homeDBManager.getEventDetails(userId, requestParams.eventId);
            // if event not found then access denied
            if (event === null || event === undefined || Object.keys(event).length === 0) {
                return {
                    status: false,
                    error: 'event not found'
                };
            }
            event = event[0];
            console.log({ event })
            // organiser can't book other organiser event's tickets but admin can book any organiser events' tickets for customer
            if (customer.role == 'organiser') {
                if (userId !== event.user_id) {
                    return {
                        'status': false,
                        'message': `organiser can't book other organiser event's tickets`,
                    };
                }
            }
            requestParams.organiserId = event.user_id;

            // 2. Check availability
            //2.1 check user cannot book ticket more than admin limitation

            let isError;
            let selectedTickets = [];
            requestParams.tickets.forEach(element => {
                if (element.quantity > adminSettings.maxTicketLimit) {
                    isError = {
                        status: false,
                        message: `user can't book tickets more than limitation`
                    };
                }
                selectedTickets.push(element.id)
            });
            // console.log({selectedTickets, isError})

            if(isError){
                return isError;
            }

            // 2.2 Check availability over booked tickets
            let tickets = await this.bookingDBManager.getTicketsByEventId(requestParams.eventId, { ids: selectedTickets });
            // console.log({ tickets })
            if (tickets === null || tickets === undefined || Object.keys(tickets).length === 0) {
                return {
                    status: false,
                    error: 'tickets not found'
                };
            }
            // already booked
            let alreadybooked = await this.bookingDBManager.getBookedTicketData(requestParams.eventId, null);
            // console.log({ bookings })

            let ticketsMap = {};
            tickets.forEach(function (ticket, key) {
                ticketsMap[ticket.id] = {
                    id: ticket.id,
                    title: ticket.title,
                    price: parseFloat(ticket.price)
                }

                requestParams.tickets.forEach(function (selectedTicket, k) {
                    if (ticket.id === selectedTicket['id']) {
                        if (selectedTicket['quantity'] > ticket.quantity) {
                            isError = {
                                'status': false,
                                'error': ticket.title + ' vacant - ' + ticket.quantity
                            };
                        }
                        alreadybooked.forEach(function (booking, k2) {
                            if (moment(booking.event_start_date).format('YYYY-MM-DD') === requestParams.bookingDate && booking.ticket_id === ticket.id) {
                                var available = ticket.quantity - parseInt(booking.totalBooked);
                                if (selectedTicket['quantity'] > available) {
                                    isError = {
                                        'status': false,
                                        'error': ticket.title + ' vacant - ' + available
                                    };
                                }
                            }
                        });
                    }
                });
            });

            if(isError){
                return isError;
            }

            //check user select correct ticket or not
            if(selectedTickets.length != Object.keys(ticketsMap).length){
                return {
                    'status': false,
                    'error': 'tickets not found'
                };
            }

            console.log({ ticketsMap })

            // 3. TIMING & DATE CHECK 
            const bookingDate = requestParams['bookingDate'];
            const bookingStartTime = requestParams['startTime'];
            const bookingEndTime = requestParams['endTime'];
            console.log({ bookingDate, bookingStartTime, bookingEndTime })

            // booking date is event start date and it is less than today's date then user can't book tickets
            let bookingDateTime = moment(bookingDate + ' ' + bookingStartTime);
            let eventStartDateTime = moment(moment(event['start_date']).format('YYYY-MM-DD') + ' ' + event.start_time);
            let eventEndDateTime = moment(moment(event['end_date']).format('YYYY-MM-DD') + ' ' + event.end_time);
            // // for repetitive event
            // if (event['repetitive'] && !bookingDate) {
            //     bookingDateTime = moment(bookingDate + ' ' + bookingEndTime);
            // }
            // // for single event
            // if (!event['repetitive']) {
            //     bookingDateTime = moment(moment(event['end_date']).format('YYYY-MM-DD') + ' ' + bookingEndTime);
            // }
            // // for merge event
            // if (requestParams.bookingEndDate) {
            //     bookingDateTime = moment(requestParams.bookingEndDat + ' ' + bookingEndTime);
            // }
            const todayDateTime = moment();
            // 3.1 Booking date should not be less than today's date
            if (bookingDateTime < todayDateTime) {
                return {
                    status: false,
                    error: `Booking date should not be less than today's date`
                };
            }
            console.log({ bookingDateTime, eventStartDateTime, eventEndDateTime }, eventStartDateTime < bookingDateTime, bookingDateTime < eventEndDateTime)
            if (!((eventStartDateTime <= bookingDateTime) && (bookingDateTime <= eventEndDateTime))) {
                return {
                    status: false,
                    error: `Please select date between event`
                };
            }

            //price calculation
            let bookings = [];
            let price = 0;
            let totalPrice = 0;
            let bookingOrganiserPrice = [];
            let adminTax = [];
            let mergeSchedule = 0;
            let bookingEndDate = bookingDateTime;

            requestParams.tickets.forEach(element => {
                for (let i = 1; i <= element['quantity']; i++) {
                    let bookingInfo = {
                        'customer_id': userId,
                        'customer_name': customer['name'],
                        'customer_email': customer['email'],
                        'organiser_id': requestParams.organiserId,
                        'event_id': requestParams.eventId,
                        'ticket_id': element.id,
                        'quantity': 1,
                        'status': 1,
                        'created_at': new Date(),
                        'updated_at': new Date(),
                        'event_title': event.title,
                        'event_category': event.event_category,
                        'ticket_title': ticketsMap[element.id]['title'],
                        'item_sku': event.item_sku,
                        'currency': 'INR', //regional.currency_default
                        'event_repetitive': event.repetitive > 0 ? 1 : 0,

                        'event_start_date': (event.repetitive) ? bookingDate : event.start_date,
                        'event_end_date': (event.repetitive) ? (mergeSchedule ? bookingEndDate : bookingDate) : event.end_date,
                        'event_start_time': event.start_time,
                        'event_end_time': event.end_time,
                    }


                    let price = ticketsMap[element.id]['price'];
                    let ticketPrice = price * 1;

                    bookingInfo['price'] = price;
                    bookingInfo['ticket_price'] = ticketPrice

                    let netPrice = Utility.calculatePrice(userId, {
                        'ticket_id': element.id,
                        'quantity': 1,
                        'price': ticketPrice,
                        'taxes': adminSettings.taxes
                    })

                    console.log({ netPrice })

                    bookingInfo['tax'] = parseFloat(netPrice['tax']);
                    bookingInfo['net_price'] = parseFloat(netPrice['net_price']);
                    bookingInfo['organiser_price'] = parseFloat(netPrice['organiser_price']);
                    bookingInfo['admin_tax'] = parseFloat(netPrice['admin_tax']),
                        bookingInfo['is_paid'] = (requestParams.paymentMethod === 'offline') ? (netPrice ? 1 : 0) : 1

                    totalPrice += bookingInfo['net_price']


                    bookings.push(bookingInfo)
                }
            });
            console.log({ bookings })
            requestParams.bookings = bookings

            // calculate commission 
            requestParams = Utility.calculateCommission(userId, requestParams)

            console.log({ totalPrice })

            requestParams.transactionData = {
                'orderNumber': moment().unix(),   //generate order number 
                'transactionId': 0,
                'paymentStatus': 'pending'
            };

            requestParams.status = true //tickets available
            requestParams.totalPrice = totalPrice;

            if (totalPrice && requestParams.paymentMethod != Constants.PAYMENT_METHODS.ONLINE) {
                return {
                    status: false,
                    error: `Invalid paymentMethod`
                };
            }

            if (requestParams.orderPlace) {
                if (requestParams.paymentMethod == Constants.PAYMENT_METHODS.ONLINE) {
                    requestParams.transactionData.transactionId = requestParams.paymentId;
                    requestParams.transactionData.paymentStatus = requestParams.paymentStatus;
                    // need to validate payment
                    // requestParams = Utility.validatePayment(userId, requestParams);
                    requestParams = Utility.initCheckout(userId, requestParams);
                }
                let flag = await this.bookingDBManager.bookTicket(userId, requestParams);
                if (flag) {
                    requestParams = {
                        message: 'database failer'
                    }
                }
                requestParams = {
                    status: true,
                    message: 'booked',
                }
            }
            return requestParams

        } catch (err) {
            console.log(err)
            throw new Error(err);
        }
    }

    public async cancelTicket(userId: number, requestParams: any): Promise<any> {
        // get event details
        let event = await this.homeDBManager.getEventDetails(userId, requestParams.eventId);
        // if event not found then access denied
        if (event === null || event === undefined || Object.keys(event).length === 0) {
            return {
                status: false,
                error: 'event not found'
            };
        }
        event = event[0];

        requestParams.id = requestParams.bookingId;
        //check booking exist or not
        let checkBooking = await this.bookingDBManager.bookings(userId, requestParams);
        console.log({ checkBooking })
        if (checkBooking === null || checkBooking === undefined || Object.keys(checkBooking).length === 0) {
            return {
                status: false,
                error: 'booking not found'
            };
        }
        checkBooking = checkBooking[0];

        const eventStartDateTime = moment(moment(checkBooking.event_start_date).format('YYYY-MM-DD') + ' ' + checkBooking.event_start_time); //event start
        const todayDateTime = moment();
        // 3.1 Booking date should be greaters than today's date
        console.log({ eventStartDateTime, todayDateTime })
        if (eventStartDateTime < todayDateTime) {
            return {
                status: false,
                message: `Booking cancellation failed`
            };
        }

        // pre booking time cancellation check
        const preCancellationTime = parseFloat(adminSettings.preCancellationTime);
        const min = parseFloat(eventStartDateTime.diff(todayDateTime, 'minutes') + '');
        const hour_difference = parseFloat((Math.floor(min / 60) + '.' + (min % 60)));
        console.log({ preCancellationTime, min, hour_difference })
        if (preCancellationTime > hour_difference) {
            return {
                status: false,
                message: `Booking cancellation failed`
            }
        }
        // booking cancellation
        const bookingCancel = await this.bookingDBManager.cancelTicket(userId, requestParams);
        if (bookingCancel.affectedRows === 0) {
            return {
                status: false,
                message: `Booking cancellation failed`
            }
        }
        /* use updated booking data */
        checkBooking.bookingCancel = 1;
        return {
            status: true,
            message: 'Booking cancelled successfully'
        }
    }

    public async downloadTicket(userId: number, requestParams: any): Promise<any> {

        // get event details
        let event = await this.homeDBManager.getEventDetails(userId, requestParams.eventId);
        // if event not found then access denied
        if (event === null || event === undefined || Object.keys(event).length === 0) {
            return {
                status: false,
                error: 'event not found'
            };
        }
        event = event[0];

        requestParams.id = requestParams.bookingId;
        //check booking exist or not
        let checkBooking = await this.bookingDBManager.bookings(userId, requestParams);
        if (checkBooking === null || checkBooking === undefined || Object.keys(checkBooking).length === 0) {
            return {
                status: false,
                error: 'booking not found'
            };
        }
        checkBooking = checkBooking[0];
        console.log({ checkBooking })

        let folderPath = `./store/qrcodes/${userId}`;
        let ticketQRCodefileName = `${requestParams.eventId}-${checkBooking.order_number}.png`;
        let ticketPdfFileName = `${requestParams.eventId}-${checkBooking.order_number}.pdf`;

        let qrCodeData = {
            bookingId: requestParams.bookingId,
            eventId: requestParams.eventId,
            ticketId: requestParams.ticketId,
            orderNumber: checkBooking.order_number
        }

        let eventStartDateTime = moment(moment(checkBooking.event_start_date).format('YYYY-MM-DD') + ' ' + checkBooking.event_start_time).format('ddd MMM DD YYYY HH:mm:ss');
        let eventEndDateTime = moment(moment(checkBooking.event_end_date).format('YYYY-MM-DD') + ' ' + checkBooking.event_end_time).format('ddd MMM DD YYYY HH:mm:ss');

        downloadTicketHtmlContent = downloadTicketHtmlContent.replace("{orderNumber}", checkBooking.order_number);
        downloadTicketHtmlContent = downloadTicketHtmlContent.replace("{eventName}", event.title);
        downloadTicketHtmlContent = downloadTicketHtmlContent.replace("{date}", `${eventStartDateTime}-${eventEndDateTime}`);
        downloadTicketHtmlContent = downloadTicketHtmlContent.replace("{address}", event.address);
        downloadTicketHtmlContent = downloadTicketHtmlContent.replace("{Price}", checkBooking.price);

        console.log({ qrCodeData })
        fs.access(folderPath, (error) => {
            // already exists or not
            if (error) {
                // If current directory does not exist then create it
                fs.mkdir(folderPath, { recursive: true }, (error) => {
                    if (error) {
                        console.log(error);
                    } else {
                        // Generate the QR code
                        qrcode.toFile(`${folderPath}/${ticketQRCodefileName}`, JSON.stringify(qrCodeData), (err) => {
                            if (err) throw err;
                            console.log('QR code generated successfully!');
                            html_to_pdf.generatePdf({ content: downloadTicketHtmlContent }, { format: 'A4' }).then(pdfBuffer => {
                                console.log("PDF Buffer:-", pdfBuffer);
                                fs.writeFileSync(`${folderPath}/${ticketPdfFileName}`, pdfBuffer);
                            });

                        });
                        console.log("New Directory created successfully !!");
                    }
                });
            }
            else {
                // Generate the QR code
                qrcode.toFile(`${folderPath}/${ticketQRCodefileName}`, JSON.stringify(qrCodeData), (err) => {
                    if (err) throw err;
                    console.log('QR code generated successfully!');
                    html_to_pdf.generatePdf({ content: downloadTicketHtmlContent }, { format: 'A4' }).then(pdfBuffer => {
                        console.log("PDF Buffer:-", pdfBuffer);
                        fs.writeFileSync(`${folderPath}/${ticketPdfFileName}`, pdfBuffer);
                    });
                });
                console.log("Given Directory already exists !!");
            }
        });
        console.log({ folderPath, ticketQRCodefileName, ticketPdfFileName })
        return {
            status: true,
            url: `${folderPath}/${ticketPdfFileName}`
        }
    }
}