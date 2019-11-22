import { User } from "../../database/entity/user.entity";

export interface ITokenService {

  generateToken(user: User) : Promise<string>

  verifyToken(token: string) : Promise<boolean>

  expireToken(token: string) : Promise<void>

}