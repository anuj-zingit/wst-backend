export class BaseResponse {
    private status: string;
    private data: any;
    private validityInHours: number;

    public getValidityInHours(): number {
        return this.validityInHours;
    }

    public setValidityInHours(validityInHours: number): void {
        this.validityInHours = validityInHours;
    }

    public getStatus(): string {
        return this.status;
    }

    public setStatus(status: string): void {
        this.status = status;
    }

    public getData(): any {
        return this.data;
    }

    public setData(data: any): void {
        this.data = data;
    }
}

export enum PartnerID {
    INTAKEQ = 'INTAKEQ',
    CHIROSPRING = 'CHIROSPRING'
}