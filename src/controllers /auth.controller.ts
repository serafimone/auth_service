import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { ITokenService } from "../core/service/Itoken.service";
import { IRedisService } from "../core/service/iredis.service";
import { IAuthController } from "../core/controller/iauth.controller";
import { User } from "../database/entity/user.entity";
import * as bcrypt from "bcrypt"

export class AuthController implements IAuthController {
  
  private readonly userService: UserService;

  private readonly tokenService: ITokenService;

  private readonly redisService: IRedisService;

  constructor(userService: UserService,
              tokenSerivce: ITokenService,
              redisService: IRedisService) {
    this.userService = userService;
    this.tokenService = tokenSerivce;
    this.redisService = redisService;
  }

  public async authorize(req: Request, res: Response): Promise<void> {
    const token = await this.getTokenFromAuthHeader(req);
    if (token.length === 0) {
      res.status(401).send()
      return;
    }
    
    if (!(await this.tokenService.verifyToken(token))) {
      res.status(401).send();
      return;
    }

    if (!(await this.redisService.tryGetValue(token))) {
      res.status(401).send();
      return;
    }

    res.status(200).send();
  }
  
  public async authenticate(req: Request, res: Response): Promise<void> {
    let {login, password} = req.body;

    if (!(login && password)) {
      res.status(400).send();
      return;
    }

    let user: User;

    try {
      user = await this.userService.getByLogin(login)
    } catch(err) {
      res.status(401).send();
      return;
    }

    const comparePasswords = await bcrypt.compare(password, user.password);

    if (!comparePasswords) {
      res.status(401).send();
      return;
    }

    const token = this.generateTokenAndPutToRedis(user);

    res.send(token);
  }

  public async register(req: Request, res: Response): Promise<void> {
    let {login, password} = req.body;

    if (!(login && password)) {
      res.status(400).send();
      return;
    }

    let user: User;

    try {
      user = await this.userService.getByLogin(login)
      res.status(500).send("User already exists");
      return;
    } catch(err) {}

    user = new User();
    user.login = login;
    user.password = await bcrypt.hash(password, await bcrypt.genSalt(10));

    await this.userService.put(user);
    
    const token = this.generateTokenAndPutToRedis(user);

    res.send(token);
  }

  private async getTokenFromAuthHeader(req: Request): Promise<string> {
    if (!req.headers.authorization) {
      return "";
    }
    
    const splitHeader = req.headers.authorization.split(' ');
    
    if (!(splitHeader[0] === "Bearer")) {
      return "";
    }

    return splitHeader[1];
  }

  private async generateTokenAndPutToRedis(user: User): Promise<string> {
    const token = await this.tokenService.generateToken(user);
    await this.redisService.putValue(token, user.id.toString());

    return token;
  }

}