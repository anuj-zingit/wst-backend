import { CognitoSSOUser } from "../service-layer/models/CognitoSSOUser";
import { User } from "../service-layer/models/User";
import { AWSS3Details, CognitoDetails, DatabaseDetails } from "../config/DatabaseDetails";
import { UserLocation } from "../service-layer/models/UserLocation";
import { Creative } from "../service-layer/models/Creative";

export class Utility {
    public static getUser(item: any): User {
        let user: User = new User();
        user.setName(item.name);
        user.setEmail(item.email);
        user.setPassword(item.password);
        user.setRoleid(item.roleid);
        return user;
    }

    public static getCognitoSSOUser(item: any): CognitoSSOUser {
        let user: CognitoSSOUser = new CognitoSSOUser();
        user.setUsername(item.username ? item.username : item.email);
        user.setEmail(item.email);
        user.setPassword(item.password);
        return user;
    }

    public static getDBUser(item: any): User {
        let user: User = new User();
        user.setName(item.name);
        user.setEmail(item.email);
        user.setPassword(item.password);
        user.setId(item.id);
        user.setSettings(item.settings);
        user.setRoleid(item.role_id);
        return user;
    }

    public static getDBCognitoSSOUser(item: any): CognitoSSOUser {
        let user: CognitoSSOUser = new CognitoSSOUser();
        user.setUsername(item.username);
        user.setEmail(item.email);
        user.setPassword(item.password);
        user.setToken(item.token);
        return user;
    }

    public static getDatabaseDetails(item: any): DatabaseDetails {
        let user: DatabaseDetails = new DatabaseDetails();
        user.setHost(item.host);
        user.setConnectionLimit(item.connectionLimit);
        user.setName(item.name);
        user.setUserName(item.userName);
        user.setPassword(item.password);
        user.setPort(item.port);
        return user;
    }

    public static getCognitoDetails(item: any): CognitoDetails {
        let details: CognitoDetails = new CognitoDetails();
        details.setClientId(item.clientId);
        details.setPoolId(item.poolId);
        details.setPoolRegion(item.poolRegion);
        return details;
    }

    public static getawss3Details(item: any): AWSS3Details {
        let details: AWSS3Details = new AWSS3Details();
        details.setAccessKey(item.accessKey);
        details.setSecretKey(item.secretKey);
        return details;
    }

    public static getDateInFormat(dt: Date): any {
        //2018-12-06 10:39:35
        const padL = (nr, len = 2, chr = `0`) => `${nr}`.padStart(2, chr);

        const dateString = `${
            dt.getFullYear()}-${
            padL(dt.getMonth()+1)}-${
            padL(dt.getDate())} ${
            padL(dt.getHours())}:${
            padL(dt.getMinutes())}:${
            padL(dt.getSeconds())}`;
        return dateString;
    }

    public static getUserLocation(item: any): UserLocation {
        let userLocation: UserLocation = new UserLocation();
        userLocation.setAddress(item.address);
        userLocation.setLatitude(item.latitude);
        userLocation.setLongitude(item.longitude);
        userLocation.setCity(item.city);
        return userLocation;
    }

    public static getUserProfile(item: any): User {
        let userProfile: User = new User();
        userProfile.setName(item.name);
        userProfile.setEmail(item.email);
        userProfile.setPhone(item.phone || null);
        userProfile.setAddress(item.address || null );
        return userProfile;
    }

    public static getCreative(item: any): Creative {
        let details: Creative = new Creative();
        details.setId(item.id);
        details.setStatus(item.status);
        details.setTournamentId(item.tournamentId);
        details.setName(item.name);
        details.setTag(item.tag);
        details.setTitleSponsor(item.titleSponsor);
        details.setPoweredBy(item.poweredBy);
        details.setAssociatedSponsor(item.associatedSponsor);
        details.setCreatedAt(item.createdAt);
        details.setUpdatedAt(item.updatedAt);
        details.setCoSponsor(item.coSponsor);
        details.setVenuePartner(item.venuePartner);
        details.setPrizePartner(item.prizePartner);
        details.setMediaPartner(item.mediaPartner);
        details.setFnbPartner(item.fnbPartner);
        details.setTemplateId(item.templateId);
        details.setDescription(item.description);
        details.setOrganizerId(item.organizerId);
        details.setOrganizedBy(item.organizedBy);
        details.setFolderURL(item.folderURL);
        return details;
    }
    public static async getQuery(query: string, item: any): Promise<string> {
        let values = [];
        let keys = [];
        let escapedsql = [];
        for await (const key of Object.keys(item)) {
            keys.push(key);
            values.push("'" + item[key] + "'");
            escapedsql.push('?')
        }
        return query + keys.join() + ') values (' + values.join() + ')';
    }

    public static calculatePrice(userId: number, requestParams: any): any{
        try {
            console.log({userId, requestParams}, "--------------calculatePrice----------")

            let net_price = {};
            let amount = 0;
            let tax = 0;
            let excluding_tax = 0;
            let including_tax = 0;

            amount = requestParams['price'] * requestParams['quantity'];

            net_price['tax'] = tax;
            net_price['net_price'] = tax + amount;

            // organiser_price = net_price excluding admin_tax
            net_price['organiser_price'] = tax + amount;
            let excluding_tax_organiser = 0;
            let including_tax_organiser = 0;
            let admin_tax = 0;
            net_price['admin_tax'] = (admin_tax);

            // calculate multiple taxes on ticket
            if (requestParams['taxes'] && requestParams['taxes'].length && amount > 0) {
                requestParams['taxes'].forEach(element => {
                    if (element.rate_type == 'percent') {
                        tax = (amount * element.rate) / 100;
                        if (element.net_price == 'including') {
                            including_tax = tax + including_tax;

                            // exclude admin tax
                            if (!element.admin_tax)
                                including_tax_organiser = tax + including_tax_organiser;

                            //admin tax
                            if (element.admin_tax)
                                admin_tax = admin_tax + tax;
                        }

                        // in case of excluding
                        if (element.net_price == 'excluding') {
                            excluding_tax = tax + excluding_tax;

                            // exclude admin tax
                            if (!element.admin_tax)
                                excluding_tax_organiser = tax + excluding_tax_organiser;

                            //admin tax
                            if (element.admin_tax)
                                admin_tax = admin_tax + tax;
                        }
                    }
                    if (element.rate_type == 'fixed') {
                        tax = (requestParams['quantity'] * element.rate) / 100;
                        if (element.net_price == 'including') {
                            including_tax = tax + including_tax;

                            // exclude admin tax
                            if (!element.admin_tax)
                                including_tax_organiser = tax + including_tax_organiser;

                            //admin tax
                            if (element.admin_tax)
                                admin_tax = admin_tax + tax;
                        }

                        // in case of excluding
                        if (element.net_price == 'excluding') {
                            excluding_tax = tax + excluding_tax;

                            // exclude admin tax
                            if (!element.admin_tax)
                                excluding_tax_organiser = tax + excluding_tax_organiser;

                            //admin tax
                            if (element.admin_tax)
                                admin_tax = admin_tax + tax;
                        }
                    }
                })

                console.log({excluding_tax, including_tax})
                net_price['tax'] = (excluding_tax + including_tax);
                net_price['net_price'] = (amount + excluding_tax);

                // organiser_price excluding admin_tax
                net_price['organiser_price'] = (amount + excluding_tax_organiser);

                //admin tax
                net_price['admin_tax'] = (admin_tax);

            }

            return net_price;
        } catch (err) {
            console.log(err)
            throw new Error(err);
        }
    }

    public static calculateCommission(userId: number, requestParams: any): any{
        try {
            console.log({userId, requestParams}, "--------------calculateCommission----------")

            let commission = [];
            let adminCommission = requestParams.adminCommission || 0
            let margin = 0;

            requestParams.bookings.forEach(element => {
                // skip for free tickets
                // calculate commission on organiser_price
                // excluding admin_tax
                let organiser_price = element['organiser_price'];
                let admin_tax = element['admin_tax'];

                if (organiser_price) {
                    let commisionInfo = {
                        organiser_id: element['organiser_id'],
                        customer_paid: organiser_price
                    }

                    if (adminCommission > 0) {
                        margin = (adminCommission * organiser_price) / 100;
                    }

                    commisionInfo['organiser_earning'] = organiser_price - margin;

                    commisionInfo['admin_commission'] = commisionInfo['customer_paid'] - commisionInfo['organiser_earning'];

                    commisionInfo['admin_tax'] = admin_tax;
                    commission.push(commisionInfo)
                    element.commisionInfo = commisionInfo;
                }
            })

            return requestParams;
        } catch (err) {
            console.log(err)
            throw new Error(err);
        }
    }

    public static validatePayment(userId: number, requestParams: any, totalPrice: number): boolean {
        try {

            // check if Free event
            if (totalPrice <= 0)
                return true;

            // if offline
            if (requestParams['paymentMethod'] == 'offline'){
                return true;
            }

            return false;
        } catch (err) {
            console.log(err)
            throw new Error(err);
        }
    }

    public static initCheckout(userId: number, requestParams: any): any {
        try 
            {
                let booking = requestParams.bookings;
                let transactionData = requestParams.transactionData;
                console.log({transactionData})
                const order = {
                    item_sku: booking[0]["item_sku"],
                    order_number: transactionData.orderNumber,
                    product_title: booking[0]["event_title"],
                    price_title: '',
                    price_tagline: '',
                    price:0
                };
                let total_price = 0;
                for (const key in booking) {
                    const val = booking[key];
                    order.price_title += ' | ' + val.ticket_title + ' | ';
                    order.price_tagline += ' | ' + val.quantity + ' | ';
                    total_price += val.net_price;
                }
                order['price'] = total_price;
                console.log({order})

                let transaction = {};
                transaction['txn_id'] = transactionData.transactionId;
                transaction['amount_paid'] = order.price;
                transaction['payment_status'] = transactionData.paymentStatus || "pending";
                transaction['status'] = 0;
                transaction['created_at'] = new Date();
                transaction['updated_at'] = new Date();
                transaction['currency_code'] = 'INR';
                transaction['payment_gateway'] = 'razorpay';
                transaction['item_sku'] = order.item_sku;
                transaction['order_number'] = order.order_number;
                console.log({transaction})

                requestParams.transaction = transaction;
                return requestParams;
        } catch (err) {
            console.log(err)
            throw new Error(err);
        }
    }

    public static finishCheckout(requestParams: any, flag: any): any {
        try 
            {
                {
                    let data = requestParams;
        
                    let url = '';
                    if (flag.status) {
                        data['txn_id'] = flag.transactionId;
                        data['amount_paid'] = data.price;
                        delete data.price;
                        data['payment_status'] = flag.message;
                        data['status'] = 1;
                        data['created_at'] = new Date();
                        data['updated_at'] = new Date();
                        data['currency_code'] = 'INR';
                        data['payment_gateway'] = 'razorpay';
                        // insert data of
                    }
                }
        } catch (err) {
            console.log(err)
            throw new Error(err);
        }
    }

}