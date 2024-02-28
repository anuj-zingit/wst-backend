import { ServiceObject } from "./ServiceObject";

export class User extends ServiceObject {
    private name: string;
    private email: string;
    private password: string;
    private phone: string;
    private address: string;
    private settings: any;
    private roleid: number;

    public getRoleid(): number {
        return this.roleid;
    }

    public setRoleid(roleid: number): void {
        this.roleid = roleid;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
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

    public getPhone(): string {
        return this.phone;
    }

    public setPhone(phone: string): void {
        this.phone = phone;
    }

    public getAddress(): string {
        return this.address;
    }

    public setAddress(address: string): void {
        this.address = address;
    }

    public getSettings(): string {
        return this.settings;
    }

    public setSettings(settings: string): void {
        this.settings = JSON.parse(settings);
    }

}