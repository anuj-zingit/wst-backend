export interface IWSTProvider {
    generate(id: string, uniqueUUID: string): Promise<any>;
}