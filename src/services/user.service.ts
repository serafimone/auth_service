import { User } from "../database/entity/user.entity";
import { Repository, DeleteResult } from "typeorm";
import { IDataService } from "../core/service/idataservice.service";
import { DatabaseService } from "../database/database.service";

export class UserService implements IDataService<User> {
  
  private userRepository: Repository<User>;

  constructor(databaseService: DatabaseService) {
    this.userRepository = databaseService.getRepository<User>(User);
  }

  public async put(value: User): Promise<User> {
    return await this.userRepository.save(value);
  }

  public async get(id: number): Promise<User | undefined> {
    return await this.userRepository.findOne(id);
  }

  public async getByLogin(login: string) : Promise<User> {
    return await this.userRepository.findOneOrFail({where: {login}})
  }

  public async update(value: User): Promise<User> {
    return await this.userRepository.save(value);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }
}
