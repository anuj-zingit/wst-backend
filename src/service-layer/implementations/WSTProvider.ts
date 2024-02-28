import { IWSTProvider } from "../../service-layer/interfaces/IWSTProvider";
import { Config } from "../../config/Config";
import { Constants } from "../../utils/Constants";
import * as request from "request-promise-native";

export class WSTProvider implements IWSTProvider {
    private readonly baseUrl: string;
  
    constructor() {
      this.baseUrl = Config.getInstance().getWSTURL();
    }
  
    public async generate(id: string, uniqueUUID: string): Promise<any> {
      var options = {
        method: "POST",
        url: this.baseUrl + Constants.generatePosters,
        json: true,
        body: {
            "creative_id": id,
            "uniqueUUID": uniqueUUID
        }
      };
      try {
        let response = await request(options);
  
        if (response.status === Constants.error) {
          throw response;
        }
        return response;
      } catch (err) {
        throw err;
      }
    }
}