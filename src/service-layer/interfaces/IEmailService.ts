export interface IEmailService {
    sendEmail(params: any): Promise<any>;
}