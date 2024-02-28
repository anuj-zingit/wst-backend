import { execute } from "./MySQLDBManager";
import { ICognitoDBManager } from "../interfaces/ICognitoDBManager";
import { CognitoSSOUser } from "../../service-layer/models/CognitoSSOUser";
import { Utility } from "../../utils/Utility";

export class CognitoDBManager implements ICognitoDBManager {
  
  constructor() { }

  public async registerCognitoUser(user: CognitoSSOUser): Promise<CognitoSSOUser> {
    try{
      const dateInFormat = Utility.getDateInFormat(new Date());
      const query: string = 'INSERT INTO cognitousers (username, email, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?)';
      const result = await execute(query,[user.getUsername(), user.getEmail(), user.getPassword(), dateInFormat, dateInFormat]);
      return result && result[0] ? Utility.getDBCognitoSSOUser(result[0]) : null;
    } catch(err) { 
      throw new Error(err);
    }
  }

  public async getCognitoUserByEmail(email: string): Promise<CognitoSSOUser> {
    try{
      const result = await execute("SELECT * FROM cognitousers where email = '" + email + "'",[]);
      return result && result[0] ? Utility.getDBCognitoSSOUser(result[0]) : null;
    } catch(err) {
      throw new Error(err);
    }
  }

  public async updateToken(token: string, user: CognitoSSOUser): Promise<string> {
    try{
      const dateInFormat = Utility.getDateInFormat(new Date());
      await execute("SET SQL_SAFE_UPDATES = 0;",[]);
      const result = await execute("UPDATE cognitousers SET token = '" + token + "', updated_at = '" + dateInFormat +"' WHERE email = '" + user.getEmail() + "'",[]);
      await execute("SET SQL_SAFE_UPDATES = 1;",[]);
      return token;
    } catch(err) {
      throw new Error(err);
    }
  }

  public async getTokenByUsername(username: string, password: string): Promise<CognitoSSOUser> {
    try{
      const result = await execute("SELECT * FROM cognitousers where username = '" + username + "' AND password = '" + password + "'",[]);
      return result && result[0] ? Utility.getDBCognitoSSOUser(result[0]) : null;
    } catch(err) {
      throw new Error(err);
    }
  }

  public async getUserByToken(token: string): Promise<CognitoSSOUser> {
    try{
      const result = await execute("SELECT * FROM cognitousers where token = '" + token + "'",[]);
      return result && result[0] ? Utility.getDBCognitoSSOUser(result[0]) : null;
    } catch(err) {
      throw new Error(err);
    }
  }

  public async updatePassword(user: CognitoSSOUser): Promise<string> {
    try{
      const dateInFormat = Utility.getDateInFormat(new Date());
      await execute("SET SQL_SAFE_UPDATES = 0;",[]);
      await execute("UPDATE cognitousers SET password = '" + user.getPassword() + "', updated_at = '" + dateInFormat +"' WHERE email = '" + user.getUsername()+ "'",[]);
      await execute("UPDATE users SET password = '" + user.getPassword() + "', updated_at = '" + dateInFormat +"' WHERE email = '" + user.getUsername()+ "'",[]);
      await execute("SET SQL_SAFE_UPDATES = 1;",[]);
      return;
    } catch(err) {
      throw new Error(err);
    }
  }

  public async deleteCognitoUser(user: CognitoSSOUser): Promise<CognitoSSOUser> {
    try{
      const dateInFormat = Utility.getDateInFormat(new Date());
      await execute("SET SQL_SAFE_UPDATES = 0;",[]);
      await execute("DELETE FROM cognitousers WHERE email = '" + user.getEmail()+ "'",[]);
      await execute("SET SQL_SAFE_UPDATES = 1;",[]);
      return;
    } catch(err) {
      throw new Error(err);
    }
  }

  public async getCognitoUserByToken(token: string): Promise<CognitoSSOUser> {
    try{
      const result = await execute("SELECT * FROM cognitousers where token = '" + token + "'",[]);
      return result && result[0] ? Utility.getDBCognitoSSOUser(result[0]) : null;
    } catch(err) {
      throw new Error(err);
    }
  }

}