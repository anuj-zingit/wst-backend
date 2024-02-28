import { execute } from "./MySQLDBManager";
import { IBookingDBManager } from "../interfaces/IBookingDBManager";
import { Utility } from "../../utils/Utility";
import * as moment from "moment";
import * as mysql from 'mysql2';
import { Config } from "../../config/Config";
let dbDetails: any = { ...Config.getInstance().getDatabaseDetails() };

export class BookingDBManager implements IBookingDBManager {

    constructor() { }

    public async getTicketsByEventId(eventId: number, dataParams: any): Promise<any> {
        try {
            console.log({dataParams})
            let query = `SELECT * FROM tickets WHERE event_id=? AND status=?`;
            let params = [eventId,1];
            if (dataParams) {
                if (dataParams.search) {
                    query += ` AND (event_title like "%${dataParams.search}%" OR event_category like "%${dataParams.search}%") `
                }
                if (dataParams.ids && dataParams.ids.length) {
                    query += ` AND id in (?)`;
                    params.push(dataParams.ids)
                }
            }
            query += ` ORDER BY created_at desc`;

            const result = await execute(query, params);
            return result;

        } catch (err) {
            throw new Error(err);
        }
    }

    public async getTaxes(): Promise<any> {
        try {
            let query = `SELECT * FROM taxes WHERE status=? `;
            let params = [1];
            query += ` ORDER BY created_at desc`;

            const result = await execute(query, params);
            return result;

        } catch (err) {
            throw new Error(err);
        }
    }

    public async bookings(userId: number, dataParams: any): Promise<any> {
        try {
            let query = `SELECT bookings.*, events.thumbnail 
            FROM bookings 
            LEFT JOIN events on events.id = bookings.event_id
            WHERE customer_id=? `;
            let params = [userId];
            if (dataParams) {
                if (dataParams.search) {
                    query += ` AND (event_title like "%${dataParams.search}%" OR event_category like "%${dataParams.search}%") `
                }
                if (dataParams.ids && dataParams.ids.length) {
                    query += ` AND id in (?)`;
                    params.push(dataParams.ids)
                }
                if (dataParams.ticketId) {
                    query += ` AND ticket_id = ?`;
                    params.push(dataParams.ticketId)
                }
                if (dataParams.eventId) {
                    query += ` AND event_id = ?`;
                    params.push(dataParams.eventId)
                }
                if (dataParams.id) {
                    query += ` AND id = ?`;
                    params.push(dataParams.id)
                }
            }
            query += ` ORDER BY created_at desc`;

            const result = await execute(query, params);
            return result;
        } catch (err) {
            throw new Error(err);
        }
    }

    public async bookTicket(userId: number, dataParams: any): Promise<any> {
        // Create a MySQL connection pool
        const pool = mysql.createPool({
            connectionLimit: dbDetails.connectionLimit,
            host: dbDetails.host,
            user: dbDetails.userName,
            password: dbDetails.password,
            database: dbDetails.name,
            waitForConnections: true,
            queueLimit: 0
        });
        // Get a connection from the pool
        let connection;
        try {
            connection = await pool.promise().getConnection();

            // Start the transaction
            await connection.beginTransaction();

            //transaction is pending
            let bookings = dataParams.bookings;
            let transaction = dataParams.transaction;
            let transactionData = dataParams.transactionData;
            let paymentType = transactionData.transactionId ? 'online' : 'offline'
            console.log(
                {
                    bookings,
                    transaction,
                    transactionData,
                    commisionInfo: bookings[0].commisionInfo,
                    paymentType
                },
            )


            //save transaction fisrt data
            if (transaction) {
                let query = `insert into transactions(
                    txn_id, amount_paid, payment_status, status, created_at, updated_at,
                    currency_code, payment_gateway, item_sku, order_number
                ) 
                values (
                ?,?,?,?,?,?,
                ?,?,?,?
                )`;
                let params = [
                    transaction.txn_id, transaction.amount_paid, transaction.payment_status, transaction.status, transaction.created_at, transaction.updated_at,
                    transaction.currency_code, transaction.payment_gateway, transaction.item_sku, transaction.order_number
                ]
                let result: any = await connection.execute(query, params);
                transactionData.transactionId = result[0].insertId;
            }


            for (const element of bookings) {
                let query = `insert into bookings (
                    customer_id, customer_name, customer_email,
                    organiser_id, event_id, ticket_id, quantity, status, created_at,updated_at,
                    event_title,event_category,ticket_title,item_sku,
                    currency,event_repetitive,event_start_date,event_end_date,event_start_time,event_end_time,
                    price,ticket_price,tax,net_price,is_paid,
                    transaction_id,order_number,payment_type
                    ) 
                    values (
                    ?,?,?,
                    ?,?,?,?,?,?,?,
                    ?,?,?,?,
                    ?,?,?,?,?,?,
                    ?,?,?,?,?,
                    ?,?,?
                )`
                let params = [
                    element.customer_id, element.customer_name, element.customer_email,
                    element.organiser_id, element.event_id, element.ticket_id, element.quantity, element.status, element.created_at, element.updated_at,
                    element.event_title, element.event_category, element.ticket_title, element.item_sku,
                    element.currency, element.event_repetitive, element.event_start_date, element.event_end_date, element.event_start_time, element.event_end_time,
                    element.price, element.ticket_price, element.tax, element.net_price, element.is_paid,
                    transactionData.transactionId, transactionData.orderNumber,paymentType
                ];

                const result: any = await connection.execute(query, params);
                if (result[0].insertId && element.commisionInfo) {
                    query = `insert into commissions (
                        organiser_id, booking_id, admin_commission, customer_paid, organiser_earning, 
                        transferred, month_year, status, event_id, 
                        created_at,updated_at) 
                        values (
                        ?,?,?,?,?,
                        ?,?,?,?,
                        ?,?
                    )`
                    params = [
                        element.organiser_id, result[0].insertId, element.commisionInfo.admin_commission, element.commisionInfo.customer_paid, element.commisionInfo.organiser_earning,
                        0, `${moment().month()} ${moment().year()}`, 0, element.event_id,
                        element.created_at, element.updated_at
                    ];
                    console.log({ params })
                    await connection.execute(query, params);
                }
            }

            // Commit the transaction
            await connection.commit();
            connection.release();

            return false;
        } catch (err) {
            console.error('Transaction failed:', err);
            if (connection) {
                await connection.rollback();
                connection.release();
            }
            throw err;
        }
    }

    public async cancelTicket(userId: number, dataParams: any): Promise<any> {
        try {
            let query = `UPDATE bookings SET booking_cancel=? 
            WHERE status=? AND checked_in=? AND customer_id=? AND ticket_id=? AND id=?  
            `;
            let params = [1, 1, 0, userId, dataParams.ticketId, dataParams.bookingId];
            const result = await execute(query, params);
            return result;
        } catch (err) {
            throw new Error(err);
        }
    }

    public async getBookedTicketData(eventId: number, dataParams: any): Promise<any> {
        try {
            let query = `select event_start_date, ticket_id, SUM(quantity) as totalBooked
            FROM bookings
            WHERE event_id = ?
            group by event_start_date, ticket_id
            `;
            let params = [eventId];
            if (dataParams) {
                if (dataParams.search) {
                    query += ` AND (event_title like "%${dataParams.search}%" OR event_category like "%${dataParams.search}%") `
                }
                if (dataParams.ids && dataParams.ids.length) {
                    query += ` AND id in (?)`;
                    params.push(dataParams.ids)
                }
            }
            query += ` order by ticket_id`;

            const result = await execute(query, params);
            return result;

        } catch (err) {
            throw new Error(err);
        }
    }
}