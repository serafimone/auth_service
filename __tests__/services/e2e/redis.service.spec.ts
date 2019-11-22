import { IRedisService } from "../../../src/core/service/iredis.service";
import { RedisService } from "../../../src/services/redis.service";

describe("Redis service integration tests", () => {
  let redis: IRedisService;

  beforeAll(() => {
    redis = new RedisService();
  });

  test("Put and get value", async () => {
    await redis.putValue("someKey", "someValue");
    const result = await redis.tryGetValue("someKey");
    expect(result).not.toBeNull();
    expect(result).toStrictEqual("someValue")
  });

  test("Delete and try get value", async () => {
    await redis.deleteValue("someKey");
    const result = await redis.tryGetValue("someKey");
    expect(result).toBeNull()
  })

})