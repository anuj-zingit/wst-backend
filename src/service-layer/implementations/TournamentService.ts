import { DBManagerFactory } from "../../db-layer/DataAccessLayerFactory";
import { ITournamentDBManager } from "../../db-layer/interfaces/ITournamentDBManager";
import { ITournamentService } from "../../service-layer/interfaces/ITournamentService";
import { BaseResponse } from "../../web-layer/models/response/BaseResponse";

export class TournamentService implements ITournamentService {
    private readonly tournamentDBManager: ITournamentDBManager;

    constructor() {
        this.tournamentDBManager = DBManagerFactory.getTournamentDBManager();
    }

    public async getTournamentById(id : string): Promise<BaseResponse> {
        return await this.tournamentDBManager.getTournamentById(id);
    }
}