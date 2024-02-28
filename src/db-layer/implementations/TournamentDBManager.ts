import { ITournamentDBManager } from "../../db-layer/interfaces/ITournamentDBManager";
import { execute } from "./MySQLDBManager";

export class TournamentDBManager implements ITournamentDBManager {

    constructor() { }

    public async getTournamentById(id: string): Promise<any> {
        try{
            const result = await execute("SELECT * FROM events where id = '" + id + "'",[]);
            return result && result[0] ? result[0] : null;
        } catch(err) {
            throw new Error(err);
        }
    }
}