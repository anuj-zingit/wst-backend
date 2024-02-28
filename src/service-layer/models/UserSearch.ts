import { ServiceObject } from "./ServiceObject";

export class UserSearch extends ServiceObject {
    private userId: number;
    private eventId: number;

    public getUserId(): number {
        return this.userId;
    }

    public setUserId(userId: number): void {
        this.userId = userId;
    }

    public getEventId(): number {
        return this.eventId;
    }

    public setEventId(eventId: number): void {
        this.eventId = eventId;
    }

}