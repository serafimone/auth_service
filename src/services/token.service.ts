import { Config } from "../core/config/config";
import { User } from "../database/entity/user.entity";
import * as jwt from "jsonwebtoken"
import { ITokenService } from "../core/service/Itoken.service";

export class TokenService implements ITokenService {
  
  private readonly secret: string;

  private readonly tokenDuration: string;

  constructor() {
    this.secret = Config.secretKey; 
    this.tokenDuration = Config.tokenDuration;
  }

  public async generateToken(user: User): Promise<string> {
    const data: Object = {
      id: user.id,
      login: user.login,
    }

    return jwt.sign(data, this.secret, {expiresIn: this.tokenDuration});
  }  
  
  public async verifyToken(token: string): Promise<boolean> {
    let result = true;
    
    try {
      jwt.verify(token, this.secret);
    } catch(err) {
      result = false;
    }

    return result;
  }
  
  public async expireToken(token: string): Promise<void> {
  }

}