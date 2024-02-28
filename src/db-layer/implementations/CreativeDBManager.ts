import { ICreativeDBManager } from "../../db-layer/interfaces/ICreativeDBManager";
import { Creative } from "../../service-layer/models/Creative";
import { Utility } from "../../utils/Utility";
import { execute } from "./MySQLDBManager";


export class CreativeDBManager implements ICreativeDBManager {
  
    constructor() { }
  
    public async  saveCreative(creative: Creative): Promise<Creative> {
      try{
        const dateInFormat = Utility.getDateInFormat(new Date());
        //
        const query: string = 'INSERT INTO creatives (name, tournament_id, tag, title_sponsor, powered_by, associated_sponsor, status, created_at, updated_at, co_sponsor, venue_partner, prize_partner, media_partner, f_n_b_partner, template_id, description, organiser_id, organized_by, folderURL) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const result = await execute(query,[creative.getName(), creative.getTournamentId(), creative.getTag(), creative.getTitleSponsor(), creative.getPoweredBy(), creative.getAssociatedSponsor(), creative.getStatus(), dateInFormat, dateInFormat, creative.getCoSponsor(), creative.getVenuePartner(), creative.getPrizePartner(), creative.getMediaPartner(), creative.getFnbPartner(), creative.getTemplateId(), JSON.stringify(creative.getDescription()), creative.getOrganizerId(), creative.getOrganizedBy(), creative.getFolderURL()]);
        return creative;
      } catch(err) { 
        throw new Error(err);
      }
    }

    public async  getCreative(creative: Creative): Promise<Creative> {
      try{
        const result = await execute("SELECT * FROM creatives where tournament_id = '" + creative.getTournamentId() + "' AND organiser_id = '" + creative.getOrganizerId() +"' AND template_id = '" + creative.getTemplateId() + "' ORDER BY id DESC" ,[]);
        return result && result[0] ? result[0] : null;
      }catch(err) { 
        throw new Error(err);
      }
    }
    
    public async templatesByCategoryId(categoryId: number): Promise<any> {
      try{
        const query: string = "SELECT * FROM templates where sports_category_id = '" + categoryId + "';";
        const result = await execute(query,[]);
        return result;
      } catch(err) { 
        throw new Error(err);
      }
    }

    public async getCreatives(userId: string, tournamentId: string): Promise<any> {
      try{
        const query = 'SELECT * FROM creative_mapping LEFT JOIN creatives ON creatives.id = creative_mapping.creative_id where organizer_id = '+ userId +' AND tournament_id = '+tournamentId +';';
        const result = await execute(query, []);
        return result;
      }catch(err) { 
        throw new Error(err);
      }
    }
}