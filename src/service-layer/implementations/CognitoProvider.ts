// import { logger } from "../../log";
import { Config } from "../../config/Config";
import * as request from "request-promise-native";
import * as jwkToPem from "jwk-to-pem";
import * as jwt from "jsonwebtoken";
import { DBManagerFactory } from "../../db-layer/DataAccessLayerFactory";
import { CognitoSSOUser } from "../../service-layer/models/CognitoSSOUser";
import { ICognitoProvider } from "../../service-layer/interfaces/ICognitoProvider";

// Modules, e.g. Webpack:
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');

export class CognitoProvider implements ICognitoProvider {
    private readonly poolId: string;
    private readonly clientId: string;
    private readonly poolRegion: string;

    constructor() {
        this.poolId = Config.getInstance().getCognitoDetails().getPoolId();
        this.clientId = Config.getInstance().getCognitoDetails().getClientId();
        this.poolRegion = Config.getInstance().getCognitoDetails().getPoolRegion();
    }

    public async registerCognitoUser(user: CognitoSSOUser): Promise<CognitoSSOUser> {
        var poolData = this.getPoolData();
        var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

        var attributeList = [];
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "email", Value: user.getEmail() }));
        let password = user.getPassword();
        return new Promise((resolve, reject) => {
            if(password.length < 6) {
                for(let i = password.length; i<=6 ; i++) {
                    password += "#";
                }
            }
            userPool.signUp(user.getUsername(), password, attributeList, null, async function (err, result) {
                if (err) {
                    reject(err);
                }
                if (result && result.user) {
                    let newUser = await DBManagerFactory.getCognitoDBManager().registerCognitoUser(user);
                    resolve(newUser);
                }
            });
        });
    }

    public async login(user: CognitoSSOUser): Promise<any> {
        var poolData = this.getPoolData();
        var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: user.getUsername(),
            Password: user.getPassword(),
        });

        var userData = {
            Username: user.getUsername(),
            Pool: userPool
        };

        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
        return new Promise((resolve, reject) => {
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: async function (result) {
                    console.log('access token + ' + result.getAccessToken().getJwtToken());
                    console.log('id token + ' + result.getIdToken().getJwtToken());
                    console.log('refresh token + ' + result.getRefreshToken().getToken());
                    const savedUser = await DBManagerFactory.getCognitoDBManager().updateToken(result.getAccessToken().getJwtToken(), user);
                    resolve(savedUser);
                },
                onFailure: async function (err) {
                    reject(err);
                }
            });
        });
    }

    public async changePassword(user: CognitoSSOUser, newPassword: string): Promise<any> {
        var poolData = this.getPoolData();
        var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: user.getUsername(),
            Password: user.getPassword(),
        });

        var userData = {
            Username: user.getUsername(),
            Pool: userPool,
        };
        // setup cognitoUser first
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
        
        return new Promise((resolve, reject) => {
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: async function (result) {
                    // call changePassword API for on cognitoUser
                    cognitoUser.changePassword(user.getPassword(), newPassword, async function(err, result) {
                        if (err) {
                            console.log(err.message || JSON.stringify(err));
                            reject(err);
                        }
                        console.log('call result: ' + result);
                        user.setPassword(newPassword)
                        const updateUser = await DBManagerFactory.getCognitoDBManager().updatePassword(user);
                        resolve(updateUser);
                    });
             
                },
                onFailure: async function (err) {
                    reject(err);
                }
            });
        });
    }

    public async logout(user: CognitoSSOUser): Promise<any> {
        return await DBManagerFactory.getCognitoDBManager().updateToken(null, user);
    }
    public async validateToken(token: string): Promise<any> {
        console.log("in validateToken"+token);
        console.log({url: `https://cognito-idp.${this.poolRegion}.amazonaws.com/${this.poolId}/.well-known/jwks.json`,})
        return new Promise((resolve, reject) => {
            request({
                url: `https://cognito-idp.${this.poolRegion}.amazonaws.com/${this.poolId}/.well-known/jwks.json`,
                json: true
            }, function (error, response, body) {
                console.log({error, response, body})
                if (!error && response.statusCode === 200) {
                    let pems = {};
                    var keys = body['keys'];
                    for (var i = 0; i < keys.length; i++) {
                        //Convert each key to PEM
                        var key_id = keys[i].kid;
                        var modulus = keys[i].n;
                        var exponent = keys[i].e;
                        var key_type = keys[i].kty;
                        var jwk = { kty: key_type, n: modulus, e: exponent };
                        var pem = jwkToPem(jwk);
                        pems[key_id] = pem;
                    }
                    //validate the token
                    var decodedJwt = jwt.decode(token, { complete: true });
                    console.log({decodedJwt})
                    if (!decodedJwt) {
                        reject({ "success": 0, "message": "Not a valid JWT token" });
                    } else {
                        // this code was causing some error so had to put it into else
                        var kid = decodedJwt.header.kid;
                        var pem = pems[kid];
                        if (!pem) {
                            reject({ "success": 0, "message": "Not a valid JWT token" });
                        }

                        console.log({token, pems, kid, pem})

                        jwt.verify(token, pem,async function (err, payload) {
                            console.log({err, payload})
                            if (err) {
                                reject({ "success": 0, "message": "Not a valid JWT token" });
                            } else {
                                // get user data based on token
                                payload.userData= await DBManagerFactory.getCognitoDBManager().getCognitoUserByToken(token);
                                console.log("payload.userData"+payload.userData);
                                resolve(payload);
                            }
                        });
                    }


                } else {
                    reject("Error! Unable to download JWKs");
                }
            });
        });
    }
    // public async validateToken_ori(token: string): Promise<any> {
    //     console.log("Rajat Token "+token);
    //     return new Promise((resolve, reject) => {
    //         request({
    //             url: `https://cognito-idp.${this.poolRegion}.amazonaws.com/${this.poolId}/.well-known/jwks.json`,
    //             json: true
    //         }, function (error, response, body) {
    //             if (!error && response.statusCode === 200) {
    //                 let pems = {};
    //                 var keys = body['keys'];
    //                 for (var i = 0; i < keys.length; i++) {
    //                     //Convert each key to PEM
    //                     var key_id = keys[i].kid;
    //                     var modulus = keys[i].n;
    //                     var exponent = keys[i].e;
    //                     var key_type = keys[i].kty;
    //                     var jwk = { kty: key_type, n: modulus, e: exponent };
    //                     var pem = jwkToPem(jwk);
    //                     pems[key_id] = pem;
    //                 }
    //                 //validate the token
    //              //   token.replace(/['"]+/g, '');
    //                 var decodedJwt = jwt.decode(token, { complete: true });
    //                 if (!decodedJwt) {
    //                     reject({ "success": 0, "message": "Not a valid JWT token" });
    //                 } else {
    //                     // this code was causing some error so had to put it into else
    //                     var kid = decodedJwt.header.kid;
    //                     var pem = pems[kid];
    //                     if (!pem) {
    //                         reject({ "success": 0, "message": "Not a valid JWT token" });
    //                     }

    //                     jwt.verify(token, pem,async function (err, payload) {
    //                         if (err) {
    //                             reject({ "success": 0, "message": "Not a valid JWT token" });
    //                         } else {
    //                             // get user data based on token
    //                             payload.userData= await DBManagerFactory.getCognitoDBManager().getCognitoUserByToken(token);
    //                             resolve(payload);
    //                         }
    //                     });
    //                 }


    //             } else {
    //                 reject("Error! Unable to download JWKs");
    //             }
    //         });
    //     });
    // }

    // public async updateAttribute(username: string, email: string,password: string): Promise<any> {
    //     var poolData = this.getPoolData();
    //     var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    //     var userData = {
    //         Username: username,
    //         Pool: userPool,
    //     };
    //     // setup cognitoUser first
    //     var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    //     var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
    //         Username: username,
    //         Password: password,
    //     });

    //     return new Promise((resolve, reject) => {
    //         cognitoUser.authenticateUser(authenticationDetails, {
    //             onSuccess: async function (result) {
    //                 var attributeList = [];
    //                 var attribute = {
    //                     Name: 'email',
    //                     Value: email,
    //                 };
    //                 var attribute2 = {
    //                     Name: 'email_verified',
    //                     Value: true,
    //                 };
    //                 attribute = new AmazonCognitoIdentity.CognitoUserAttribute(attribute);
    //                 attribute2 = new AmazonCognitoIdentity.CognitoUserAttribute(attribute2);
    //                 attributeList.push(attribute);
    //                 attributeList.push(attribute2);

    //                 cognitoUser.updateAttributes(attributeList, function(err, result) {
    //                     if (err) {
    //                         logger.error("error while updating attribute" + err.message || JSON.stringify(err));
    //                         reject(err);
    //                     }
    //                     resolve(result);
    //                 });
    //             },
    //             onFailure: async function (err) {
    //                 logger.error("Error while updating attributes ===> " + JSON.stringify(err));
    //                 reject(err);
    //             }
    //         });
    //     });
    // }

    public async forgotpassword(user: CognitoSSOUser): Promise<any> {
        var poolData = this.getPoolData();
        var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
        var userData = {
            Username: user.getUsername(),
            Pool: userPool,
        };
        // setup cognitoUser first
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    
        // call forgotPassword on cognitoUser
        cognitoUser.forgotPassword({
            onSuccess: function(result) {
                console.log('call result: ' + result);
                return true;
            },
            onFailure: function(err) {
                console.log("Error while forgot pwd ===> " + JSON.stringify(err));
                throw new Error(err);
            },
            inputVerificationCode() { // this is optional, and likely won't be implemented as in AWS's example (i.e, prompt to get info)
                console.log('code sent');
                return true;
            }
        });
    }

    public async updatePassword(user: CognitoSSOUser, code: string): Promise<any> {
        var poolData = this.getPoolData();
        var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
        var userData = {
            Username: user.getUsername(),
            Pool: userPool,
        };
        // setup cognitoUser first
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    
        // call forgotPassword on cognitoUser
        return new Promise(async (resolve, reject) => {
            cognitoUser.confirmPassword(code, user.getPassword(), {
                async onFailure(err) {
                    reject(err);
                },
                async onSuccess(result) {
                    const updateUser = await DBManagerFactory.getCognitoDBManager().updatePassword(user);
                    resolve(result);
                },
            });
        });
    }

    private getPoolData() {
        return {
            UserPoolId: this.poolId,
            ClientId: this.clientId
        }
    }
}