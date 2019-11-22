import { IRedisService } from "../core/service/iredis.service";
import { Config } from "../core/config/config";
import { createHandyClient, IHandyRedis } from 'handy-redis';

export class RedisService implements IRedisService {
  
  private redis: IHandyRedis;

  constructor() {
    this.redis = createHandyClient({
      host: Config.redisHost,
      port: Config.redisPort
    });
  }

  public async putValue(key: string, value: string): Promise<void> {
    await this.redis.set(key, value);
  }  
  
  public async tryGetValue(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  public async deleteValue(key: string): Promise<void> {
    await this.redis.del(key);
  }

}