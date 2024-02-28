import { Body, Get, JsonController, Post, QueryParam, Req, Res } from "routing-controllers";
import { ServiceFactory } from "../../service-layer/ServiceFactory";
import { Creative } from "../../service-layer/models/Creative";
import { ICreativeService } from "../../service-layer/interfaces/ICreativeService";
import { Utility } from "../../utils/Utility";

@JsonController("/creative")
export class CreativeController {
    private readonly creativeService: ICreativeService;
    constructor() {
        this.creativeService = ServiceFactory.getCreativeService();
    }

    @Post("/add")
    public async saveCreative(@Body() req: Creative): Promise<Creative> {
        const creative: Creative = Utility.getCreative(req);
        await this.creativeService.saveCreative(creative);
        return await this.creativeService.getCreative(creative);
    }

    @Get("/generate")
    public async generate(@QueryParam("id") id: string, @QueryParam("uniqueUUID") uniqueUUID: string): Promise<Creative> {
        return await this.creativeService.generate(id, uniqueUUID);
    }

    @Get("/templatesByCategoryId")
    public async templatesByCategoryId(@QueryParam("categoryId") categoryId: number): Promise<Creative> {
        return await this.creativeService.templatesByCategoryId(categoryId);
    }

    @Get("")
    public async getCreatives(@QueryParam("userId") userId: string, @QueryParam("tournamentId") tournamentId: string): Promise<Creative> {
        return await this.creativeService.getCreatives(userId, tournamentId);
    }
}