export interface IRedisService {

  putValue(key: string, value: string) : Promise<void>

  tryGetValue(key: string): Promise<string | null>

  deleteValue(key: string) : Promise<void>

}