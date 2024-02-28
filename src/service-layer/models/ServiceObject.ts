export enum ObjectStatus {
    Unknown = "unknown",
    Active = "active",
    Deleted = "deleted",
    Deactivated = 'deactivated'
}

export class ServiceObject {
    private id: string;
    private created_at: Date;
    private updated_at: Date;
    private status: ObjectStatus;

    public getCreated_at(): Date {
        return this.created_at;
    }

    public setCreated_at(created_at: Date): void {
        this.created_at = created_at;
    }

    public getUpdated_at(): Date {
        return this.updated_at;
    }

    public setUpdated_at(updated_at: Date): void {
        this.updated_at = updated_at;
    }

    public getId(): string {
        return this.id;
    }

    public setId(id: string): void {
        this.id = id;
    }

    public getStatus(): ObjectStatus {
        return this.status;
    }

    public setStatus(status: ObjectStatus): void {
        this.status = status;
    }
}