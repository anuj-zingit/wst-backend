
export class DatabaseDetails {
    private connectionLimit: number;
    private name: string;
    private port: number;
    private password: string;
    private userName: string;
    private host: string;

    public getConnectionLimit(): number {
        return this.connectionLimit;
    }

    public setConnectionLimit(connectionLimit: number): void {
        this.connectionLimit = connectionLimit;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getPort(): number {
        return this.port;
    }

    public setPort(port: number): void {
        this.port = port;
    }

    public getPassword(): string {
        return this.password;
    }

    public setPassword(password: string): void {
        this.password = password;
    }

    public getUserName(): string {
        return this.userName;
    }

    public setUserName(userName: string): void {
        this.userName = userName;
    }

    public getHost(): string {
        return this.host;
    }

    public setHost(host: string): void {
        this.host = host;
    }
}

export class CognitoDetails {
    private poolId: string;
    private poolRegion: string;
    private clientId: string;

    public getPoolId(): string {
        return this.poolId;
    }

    public setPoolId(poolId: string): void {
        this.poolId = poolId;
    }

    public getPoolRegion(): string {
        return this.poolRegion;
    }

    public setPoolRegion(poolRegion: string): void {
        this.poolRegion = poolRegion;
    }

    public getClientId(): string {
        return this.clientId;
    }

    public setClientId(clientId: string): void {
        this.clientId = clientId;
    }
}

export class AWSS3Details {
    private accessKey: string;
    private secretKey: string;

    public getAccessKey(): string {
        return this.accessKey;
    }

    public setAccessKey(accessKey: string): void {
        this.accessKey = accessKey;
    }

    public getSecretKey(): string {
        return this.secretKey;
    }

    public setSecretKey(secretKey: string): void {
        this.secretKey = secretKey;
    }
}