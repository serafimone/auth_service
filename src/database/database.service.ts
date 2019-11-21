import { Connection, createConnection, EntitySchema, Repository } from 'typeorm'

export class DatabaseService {

  private connection!: Connection

  public constructor() {}

  public async connect() {
    await createConnection()
      .then(async connection => {
        this.connection = connection;})
      .catch(err => console.error(err));
  }

  public getRepository<T>(entity: any): Repository<T> {
    return this.connection.getRepository<T>(entity);
  }

  public disconnect() {
    this.connection.close()
  }

}
