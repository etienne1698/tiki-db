import { expect, test } from "vitest";

import { VueDatabase } from "../src/Database";
import Repository from "../src/Repository";
import Model from "../src/Model";

test("simple save and retrieve", () => {
  const db = new VueDatabase();

  class User extends Model {
    static override entity = "users";

    declare id: string;
  }
  const userRespo = Repository.createWithOptions({ use: User, database: db });

  userRespo.save({ id: "123" });

  expect(userRespo.query().getFirst().id).toBe("123");
});
