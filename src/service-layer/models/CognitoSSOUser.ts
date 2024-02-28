import { ServiceObject } from "./ServiceObject";

export class CognitoSSOUser extends ServiceObject {
    private username: string;
    private email: string;
    private password: string;
    private token: string;
    private expiryDays: number;

    public getExpiryDays(): number {
        return this.expiryDays;
    }

    public setExpiryDays(expiryDays: number): void {
        this.expiryDays = expiryDays;
    }

    public getToken(): string {
        return this.token;
    }

    public setToken(token: string): void {
        this.token = token;
    }

    public getUsername(): string {
        return this.username;
    }

    public setUsername(username: string): void {
        this.username = username;
    }

    public getEmail(): string {
        return this.email;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    public getPassword(): string {
        return this.password;
    }

    public setPassword(password: string): void {
        this.password = password;
    }
}