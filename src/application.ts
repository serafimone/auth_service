import Express from 'express';
import { Config } from './core/config/config';
import { DatabaseService } from './database/database.service';
import LoggerService from './core/logger/logger.service';
import { UserService } from './services/user.service';
import { ITokenService } from './core/service/Itoken.service';
import { TokenService } from './services/token.service';

export default class Application {
  
  private http!: Express.Express

  private logger!: LoggerService

  private database!: DatabaseService

  private userService!: UserService

  private tokenService!: ITokenService

  private static instance: Application;

  private constructor() {
    this.http = Express();
    this.initializeServices();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Application();
    }
    
    return this.instance;
  }

  public static getAppLogger(): LoggerService {
    return this.getInstance().logger;
  }

  public static async run() {
    return this.getInstance().run();
  }

  protected async initializeServices() {
    this.logger = new LoggerService();
    this.database = new DatabaseService();
    await this.database.connect();
    this.userService = new UserService(this.database);
    this.tokenService = new TokenService();
  }

  protected run() {
    this.http.listen(Config.port, () => {
      this.logger.write('Here is started!');
    });
  }

}
