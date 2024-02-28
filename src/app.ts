import * as express from "express";
import * as bodyParser from "body-parser";
import { useExpressServer } from "routing-controllers";
import "reflect-metadata"; // this is required
import "class-transformer";
import { DBManagerFactory } from "./db-layer/DataAccessLayerFactory";
import { AuthController } from "./web-layer/controllers/AuthController";

import * as cors from "cors";
import * as MySQLDBManager from "./db-layer/implementations/MySQLDBManager";
import { Config } from "./config/Config";
import { AuthDBManager } from "./db-layer/implementations/AuthDBManager";
import { ServiceFactory } from "./service-layer/ServiceFactory";
import { AuthService } from "./service-layer/implementations/AuthService";
import { CognitoDBManager } from "./db-layer/implementations/CognitoDBManager";
import { CognitoProvider } from "./service-layer/implementations/CognitoProvider";
import { HomeController } from "./web-layer/controllers/HomeController";
import { HomeDBManager } from "./db-layer/implementations/HomeDBManager";
import { HomeService } from "./service-layer/implementations/HomeService";
import { UserController } from "./web-layer/controllers/UserController";
import { UserDBManager } from "./db-layer/implementations/UserDBManager";
import { UserService } from "./service-layer/implementations/UserService";
import { BookingController } from "./web-layer/controllers/BookingController";
import { BookingDBManager } from "./db-layer/implementations/BookingDBManager";
import { BookingService } from "./service-layer/implementations/BookingService";
import { SSOService } from "./service-layer/implementations/SSOService";
import { SSOController } from "./web-layer/controllers/SSOController";
import { CreativeController } from "./web-layer/controllers/CreativeController";
import { CreativeService } from "./service-layer/implementations/CreativeService";
import { CreativeDBManager } from "./db-layer/implementations/CreativeDBManager";
import { TournamentController } from "./web-layer/controllers/TournamentController";
import { TournamentService } from "./service-layer/implementations/TournamentService";
import { TournamentDBManager } from "./db-layer/implementations/TournamentDBManager";
import { WSTProvider } from "./service-layer/implementations/WSTProvider";
import { EmailService } from "./service-layer/implementations/EmailService";

class App {
    private routingControllersOptions = {};
    public app: express.Application;
    public dbDetails: any;

    constructor() {
        this.app = express();
        this.dbDetails = {...Config.getInstance().getDatabaseDetails()};
        this.app.use(bodyParser.json({ limit: '10mb' }));
        this.config();
    }

    public InitializeCore(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.setup().then(() => {
                return resolve();
            });
        });
    }

    private setup(): Promise<void> {
        return new Promise((resolve, reject) => {
            // create singleton instance of db and connect to database before starting app
            try {
                MySQLDBManager.init(this.dbDetails);
                console.log('Connection success');

                DBManagerFactory.setAuthDBManager(new AuthDBManager());
                DBManagerFactory.setCognitoDBManager(new CognitoDBManager());
                DBManagerFactory.setHomeDBManager(new HomeDBManager());
                DBManagerFactory.setUserDBManager(new UserDBManager());
                DBManagerFactory.setBookingDBManager(new BookingDBManager());
                DBManagerFactory.setCreativeDBManager(new CreativeDBManager());
                DBManagerFactory.setTournamentDBManager(new TournamentDBManager());

                ServiceFactory.setAuthService(new AuthService());
                ServiceFactory.setCognitoProvider(new CognitoProvider());
                ServiceFactory.setHomeService(new HomeService());
                ServiceFactory.setUserService(new UserService());
                ServiceFactory.setBookingService(new BookingService());
                ServiceFactory.setSSOService(new SSOService());
                ServiceFactory.setWSTProvider(new WSTProvider());
                ServiceFactory.setCreativeService(new CreativeService());
                ServiceFactory.setTournamentService(new TournamentService());
                ServiceFactory.setEmailService(new EmailService());

                return resolve();
            }catch(err){
                console.log('Error while connect with DB *****', err);
            }
        });
    }

    private config(): void {
        //Cors header passes through
        this.app.use(cors());
        this.app.options('*', cors());

        // support application/json type post data
        this.app.use(bodyParser.json());

        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));

        //API routers
        this.routingControllersOptions = {
            development: false,
            classTransformer: false,
            validation: {
                skipMissingProperties: false,
                whitelist: true
            },
            cors: true,
            routePrefix: "/ws",
            defaults:
            {
                //with this option, null will return 404 by default
                nullResultCode: 404,

                //with this option, void or Promise<void> will return 204 by default 
                undefinedResultCode: 204,

                paramOptions: {
                    //with this option, argument will be required by default
                    required: true
                }
            },
            //controllers: [__dirname + "/web-layer/controllers/*.js"]
            controllers: [AuthController,HomeController, UserController, BookingController, SSOController, CreativeController, TournamentController]

        }
        useExpressServer(this.app, this.routingControllersOptions);
    }

    public getRoutingControllersOptions() {
        return this.routingControllersOptions;
    }

}

const app = new App()
const expressApp = app.app
const initializeConfig = app.InitializeCore()
export default { expressApp, initializeConfig }