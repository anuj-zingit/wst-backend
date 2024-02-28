import { Body, Get, JsonController, Post, QueryParam, Req, Res } from "routing-controllers";
import { ServiceFactory } from "../../service-layer/ServiceFactory";
import { UserRequest } from "../../web-layer/models/request/UserRequest";
import { IAuthService } from "../../service-layer/interfaces/IAuthService";
import { Utility } from "../../utils/Utility";
import { User } from "../../service-layer/models/User";
import { CognitoSSOUser } from "../../service-layer/models/CognitoSSOUser";
import { ICognitoProvider } from "../../service-layer/interfaces/ICognitoProvider";
import { Jwt } from "../../middleware/Jwt";
import { BaseResponse } from "web-layer/models/response/BaseResponse";

@JsonController()
export class AuthController {
  private readonly authService: IAuthService;
  private readonly cognitoProvider: ICognitoProvider;
  private readonly jwtService: Jwt;

  constructor() {
    this.authService = ServiceFactory.getAuthService();
    this.cognitoProvider = ServiceFactory.getCognitoProvider();
    this.jwtService = new Jwt();
  }

  @Post("/register")
  public async register(@Body() req: UserRequest): Promise<any> {
    const user: User = Utility.getUser(req);
    // checks user in users DB
    const existingUser: User = await this.authService.getUserByEmail(user.getEmail());
    if (existingUser) {
      // check user in cognito 
      const existingCognitoUser: CognitoSSOUser = await this.authService.getCognitoUserByEmail(user.getEmail());
      if (existingCognitoUser) {
        throw new Error("User is already registered.");
      } else {
        //register user in cognito
        const cognitoUser: CognitoSSOUser = Utility.getCognitoSSOUser(user);
        await this.cognitoProvider.registerCognitoUser(cognitoUser);
      }
    } else {
      // register in cognito + save user in DB
      await this.authService.register(user);
    }
    return "User is successfully regsitered!";
  }

  @Post("/login")
  public async login(@Body() req: UserRequest): Promise<any> {
    //check users in db
    const cognitoUser: CognitoSSOUser = Utility.getCognitoSSOUser(req);
    const user: User = await this.authService.getUserByEmail(req.email);
    if (user) {
      // check for user in cognito
      const existingCognitoUser: CognitoSSOUser = await this.authService.getCognitoUserByEmail(req.email);
      if (!existingCognitoUser) {
        // register to cognito
        await this.cognitoProvider.registerCognitoUser(cognitoUser);
      }

      // match the email and password
      if (user.getEmail() === req.email) {
        // login the user through cognito
        const loggedInUserToken = await this.cognitoProvider.login(cognitoUser);
        // return user details with cognito token
        user['token'] = loggedInUserToken;
        return user;
      } else {
        throw new Error("Please fill correct credentials.");
      }
    } else {
      throw new Error("User does not exist!!");
    }
  }

  @Post("/forgotPassword")
  public async forgotpassword(@Body() req: any, @Res() res: any): Promise<any> {
    if (!req.email) {
      return res.status(400).json({ message: "Invalid email" });
    }

    //check users in db
    const user: User = await this.authService.getUserByEmail(req.email);
    if (user) {

      // check for user in cognito
      const existingCognitoUser: CognitoSSOUser = await this.authService.getCognitoUserByEmail(req.email);
      if (!existingCognitoUser) {
        throw new Error("Cognito User does not exist!!");
      }

      const cognitoUser: CognitoSSOUser = Utility.getCognitoSSOUser(req);
      await this.cognitoProvider.forgotpassword(cognitoUser);
      return { message:  "Code sent" };
    } else {
      throw new Error("User does not exist!!");
    }
  }

  @Post("/updatePassword")
  public async updatePassword(@Body() req: any, @Res() res: any): Promise<any> {
    if (!req.email) {
      return res.status(400).json({ message: "Invalid email" });
    }
    const user: User = await this.authService.getUserByEmail(req.email);
    if (user) {
      // check for user in cognito
      const existingCognitoUser: CognitoSSOUser = await this.authService.getCognitoUserByEmail(req.email);
      if (!existingCognitoUser) {
        throw new Error("Cognito User does not exist!!");
      }

      const cognitoUser: CognitoSSOUser = Utility.getCognitoSSOUser(req);
      await this.cognitoProvider.updatePassword(cognitoUser, req.code);
      return "Password updated successfully";
    } else {
      throw new Error("User does not exist!!");
    }
  }

  @Post("/changePassword")
  public async changePassword(@Body() req: any, @Res() res: any): Promise<any> {
    if (!req.email) {
      return res.status(400).json({ message: "Invalid email" });
    }
    //check users in db
    const user: User = await this.authService.getUserByEmail(req.email);
    if (user) {
      // check for user in cognito
      const existingCognitoUser: CognitoSSOUser = await this.authService.getCognitoUserByEmail(req.email);
      if (!existingCognitoUser) {
        throw new Error("Cognito User does not exist!!");
      }
      // match the email and password
      if (user.getEmail() === req.email && user.getPassword() === req.password) {
        const cognitoUser: CognitoSSOUser = Utility.getCognitoSSOUser(req);
        await this.cognitoProvider.changePassword(cognitoUser, req.newPassword);
        return "Password updated successfully";
      } else {
        throw new Error("Old password is incorrect");
      }
    } else {
      throw new Error("User does not exist!!");
    }
  }

  @Post("/logout")
  public async logout(@Req() req: any, @Res() res: any): Promise<any> {
    let [validToken, decodedToken] = await this.jwtService.validateToken(req);
    console.log({decodedToken})
    if (!validToken) {
      return res.status(401).json({message :  "Invalid Token"});
    }
    req.email = decodedToken.userData.email;
    if (!req.email) {
      return res.status(400).json({ message: "Invalid email" });
    }
    //check users in db
    const user: User = await this.authService.getUserByEmail(req.email);
    if (user) {
      // check for user in cognito
      const existingCognitoUser: CognitoSSOUser = await this.authService.getCognitoUserByEmail(req.email);
      if (!existingCognitoUser) {
        throw new Error("Cognito User does not exist!!");
      }
      const cognitoUser: CognitoSSOUser = Utility.getCognitoSSOUser(req);
      await this.cognitoProvider.logout(cognitoUser);
      return { message:  "Success" };
    } else {
      throw new Error("User does not exist!!");
    }
  }

  @Get("/aws/config")
    public async getAWSConfig(): Promise<BaseResponse> {
        return await this.authService.getAWSConfig();
  }

}