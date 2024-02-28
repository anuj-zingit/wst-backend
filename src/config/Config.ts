import { Utility } from "../utils/Utility";
import { AWSS3Details, CognitoDetails, DatabaseDetails } from "./DatabaseDetails";
import { localDevelopment } from "./localDevelopment";
import { production } from "./production";
import { qa } from "./qa";
import { rc } from "./rc";

export class Config {
    private static _instance: Config;
    private env: string;
    private port: number;
    private logLevel: string;
    private databaseDetails: DatabaseDetails;
    private cognitoDetails: CognitoDetails;
    private awss3Details: AWSS3Details;
    private WSTURL: string;

    private constructor() {
        // TODO: Uncomment once deployment through kubernetes will be ready. Currently running through PM2.
        this.env = process.env.NODE_ENV || 'qa';
        console.log(this.getData());
        this.load(this.getData());
    }

    public static getInstance(): Config {
        return this._instance || (this._instance = new this());
    }

    public getEnvironment(): string {
        return this.env;
    }

    public isDevelopment(): boolean {
        return this.getEnvironment() == "development";
    }

    public isProduction(): boolean {
        return this.getEnvironment() == "production";
    }

    public getLogLevel(): string {
        return this.logLevel
    }

    public getPort(): number {
        return this.port
    }

    public getDatabaseDetails(): DatabaseDetails {
        return this.databaseDetails;
    }

    public getCognitoDetails(): CognitoDetails {
        return this.cognitoDetails;
    }

    public getawss3Details(): AWSS3Details {
        return this.awss3Details;
    }

    public getWSTURL(): string {
        return this.WSTURL;
    }

    private getData(): any {
        switch (this.env) {
            case "production":
                return production;
            case "qa":
                return qa;
            case "rc":
                return rc;
            default:
                return localDevelopment;
        }
    }

    private load(data: any): void {
        this.port = parseInt(process.env.PORT ? process.env.PORT : (data.app.port || 3000));
        this.logLevel = data.app.logLevel || 'debug';
        this.databaseDetails = Utility.getDatabaseDetails(data.database);
        this.cognitoDetails = Utility.getCognitoDetails(data.amazonCognito);
        this.awss3Details = Utility.getawss3Details(data.s3);
        this.WSTURL = data.WST.URL;
    }
}