import { IAuthDBManager } from "../../db-layer/interfaces/IAuthDBManager";
import { execute } from "./MySQLDBManager";
import { User } from "../../service-layer/models/User";
import { Utility } from "../../utils/Utility";
import { BaseResponse } from "../../web-layer/models/response/BaseResponse";

export class AuthDBManager implements IAuthDBManager {
  
  constructor() { }

  public async register(user: User): Promise<User> {
      try{
        const query: string = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        return execute(query,[user.getName(), user.getEmail(), user.getPassword()]);
      } catch(err) {
        throw new Error(err);
      }
  }

  public async getUserByEmail(email: string): Promise<User> {
    try{
      const result = await execute("SELECT * FROM users where email = '" + email + "'",[]);
      return result && result[0] ? Utility.getDBUser(result[0]) : null;
    } catch(err) {
      throw new Error(err);
    }
  }

  public async getAWSConfig(): Promise<BaseResponse> {
    try{
      const result = await execute("SELECT * FROM awsconfig",[]);
      let response: BaseResponse = new BaseResponse();
      response.setData(result);
      return response;
    } catch(err) {
      throw new Error(err);
    }
  }

}