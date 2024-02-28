import { Body, Get, JsonController, Post, QueryParam, Req, Res } from "routing-controllers";
import { ServiceFactory } from "../../service-layer/ServiceFactory";
import { ITournamentService } from "../../service-layer/interfaces/ITournamentService";

@JsonController()
export class TournamentController {
    private readonly tournamentService: ITournamentService;

    constructor() {
        this.tournamentService = ServiceFactory.getTournamentService();
    }

    @Get("/getTournamentById")
    public async getTournamentById(@QueryParam("id") id: string): Promise<any> {
        return await this.tournamentService.getTournamentById(id);
    }
}