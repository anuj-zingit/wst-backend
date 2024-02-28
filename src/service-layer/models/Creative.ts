import { ServiceObject } from "./ServiceObject";

export class Creative extends ServiceObject {
    private name: string;
    private tournamentId: string;
    private tag: string;
    private titleSponsor: string;
    private poweredBy: string;
    private associatedSponsor: string;
    private createdAt: string;
    private updatedAt: string;
    private coSponsor: string;
    private venuePartner: string;
    private prizePartner: string;
    private mediaPartner: string;
    private fnbPartner: string;
    private templateId: string;
    private organizerId: string;
    private description: any;
    private organizedBy: string;
    private folderURL: string;

    public getFolderURL(): string {
        return this.folderURL;
    }

    public setFolderURL(folderURL: string): void {
        this.folderURL = folderURL;
    }

    public getOrganizedBy(): string {
        return this.organizedBy;
    }

    public setOrganizedBy(organizedBy: string): void {
        this.organizedBy = organizedBy;
    }
    
    public getOrganizerId(): string {
        return this.organizerId;
    }

    public setOrganizerId(organizerId: string): void {
        this.organizerId = organizerId;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getTournamentId(): string {
        return this.tournamentId;
    }

    public setTournamentId(tournamentId: string): void {
        this.tournamentId = tournamentId;
    }

    public getTag(): string {
        return this.tag;
    }

    public setTag(tag: string): void {
        this.tag = tag;
    }

    public getTitleSponsor(): string {
        return this.titleSponsor;
    }

    public setTitleSponsor(titleSponsor: string): void {
        this.titleSponsor = titleSponsor;
    }

    public getPoweredBy(): string {
        return this.poweredBy;
    }

    public setPoweredBy(poweredBy: string): void {
        this.poweredBy = poweredBy;
    }

    public getAssociatedSponsor(): string {
        return this.associatedSponsor;
    }

    public setAssociatedSponsor(associatedSponsor: string): void {
        this.associatedSponsor = associatedSponsor;
    }

    public getCreatedAt(): string {
        return this.createdAt;
    }

    public setCreatedAt(createdAt: string): void {
        this.createdAt = createdAt;
    }

    public getUpdatedAt(): string {
        return this.updatedAt;
    }

    public setUpdatedAt(updatedAt: string): void {
        this.updatedAt = updatedAt;
    }

    public getCoSponsor(): string {
        return this.coSponsor;
    }

    public setCoSponsor(coSponsor: string): void {
        this.coSponsor = coSponsor;
    }

    public getVenuePartner(): string {
        return this.venuePartner;
    }

    public setVenuePartner(venuePartner: string): void {
        this.venuePartner = venuePartner;
    }

    public getPrizePartner(): string {
        return this.prizePartner;
    }

    public setPrizePartner(prizePartner: string): void {
        this.prizePartner = prizePartner;
    }

    public getMediaPartner(): string {
        return this.mediaPartner;
    }

    public setMediaPartner(mediaPartner: string): void {
        this.mediaPartner = mediaPartner;
    }

    public getFnbPartner(): string {
        return this.fnbPartner;
    }

    public setFnbPartner(fnbPartner: string): void {
        this.fnbPartner = fnbPartner;
    }

    public getTemplateId(): string {
        return this.templateId;
    }

    public setTemplateId(templateId: string): void {
        this.templateId = templateId;
    }

    public getDescription(): any {
        return this.description;
    }

    public setDescription(description: any): void {
        this.description = description;
    }

}