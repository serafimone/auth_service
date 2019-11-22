import { DatabaseService } from "../../../src/database/database.service"
import { UserService } from "../../../src/services/user.service";
import { User } from "../../../src/database/entity/user.entity";

describe("User service integration tests", () => {

  let dataBase: DatabaseService;
  let userService: UserService;
  let user1: User;

  beforeAll(async () => {
    dataBase = new DatabaseService();
    await dataBase.connect()
    userService = new UserService(dataBase);
    user1 = new User();
    user1.id = 1;
    user1.login = "Sample";
    user1.password = "Text";
  })

  test("Add and get user test", async () => {
    await userService.put(user1);
    const user2 = await userService.get(user1.id)
    expect(user1.login).toStrictEqual((user2 as User).login);
    expect(user1.password).toStrictEqual((user2 as User).password);
  })

  test("Update user test", async () => {
    user1.login = "NotSample";
    user1.password = "NotText";
    const user2 = await userService.update(user1);
    expect(user1.login).toStrictEqual(user2.login);
    expect(user1.password).toStrictEqual(user2.password);
  })

  test("Delete user test", async () => {
    const deleteResult = await userService.delete(user1.id);
    expect(deleteResult.affected).toStrictEqual(1);
  })
  
}) 