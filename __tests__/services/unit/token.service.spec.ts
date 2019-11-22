import { ITokenService } from "../../../src/core/service/Itoken.service"
import { TokenService } from "../../../src/services/token.service"
import { User } from "../../../src/database/entity/user.entity";
import * as jwt from "jsonwebtoken";
import { Config } from "../../../src/core/config/config";

describe("Token service tests", () => {

  let tokenService: ITokenService;
  let user: User;

  beforeAll(() => {
    tokenService = new TokenService();
    user = new User();
    user.id = 1;
    user.login = "Sample";
  });

  test("Generate token test", async () => {
    let token = await tokenService.generateToken(user);
    expect(token.length).toBeGreaterThan(1)
  });

  test("Validate correct token test", async () => {
    const data = {
      id: user.id,
      login: user.login
    }
    const goodToken = jwt.sign(data, Config.secretKey, {expiresIn: Config.tokenDuration})
    const result = await tokenService.verifyToken(goodToken);
    expect(result).toStrictEqual(true);
  });

  test("Validate wrong token test", async () => {
    const data = {
      id: user.id,
      login: user.login
    }
    const wrongToken = jwt.sign(data, "wrongSecret", {expiresIn: Config.tokenDuration});
    const result = await tokenService.verifyToken(wrongToken);
    expect(result).toStrictEqual(false);
  })

})