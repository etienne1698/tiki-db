import { expect, test } from "vitest";

import { VueDatabase } from "../src/Database";
import Repository from "../src/Repository";
import Relation from "../src/Relation";
import Model from "../src/Model";

test("simple save and retrieve", () => {
  const db = new VueDatabase();

  class User extends Model {
    static override entity = "users";

    declare id: string;
  }
  const usersRespo = Repository.createWithOptions({ use: User, database: db });

  usersRespo.save({ id: "123" });

  expect(usersRespo.query().getFirst().id).toBe("123");
});

test("relation should not be saved in entity state", () => {
  const db = new VueDatabase();

  class User extends Model {
    static override entity = "users";

    static override relations(): Record<string, Relation<any>> {
      return {
        pets: Relation.hasMany(Pet, "user_id"),
      };
    }

    declare id: string;
  }

  class Pet extends Model {
    static override entity = "users";

    declare id: string;
    declare user_id: string;
  }
  const usersRespo = Repository.createWithOptions({ use: User, database: db });

  usersRespo.save({ id: "123", pets: [{ id: "1", user_id: "123" }] });

  // @ts-ignore
  expect(usersRespo.query().getFirst().pets).toBe(undefined);
});

test("relation should be save to the relation entity state", () => {
  const db = new VueDatabase();

  class User extends Model {
    static override entity = "users";

    static override relations(): Record<string, Relation<any>> {
      return {
        pets: Relation.hasMany(Pet, "user_id"),
      };
    }

    declare id: string;
  }

  class Pet extends Model {
    static override entity = "users";

    declare id: string;
    declare user_id: string;
  }
  const usersRespo = Repository.createWithOptions({ use: User, database: db });
  const petsRespo = Repository.createWithOptions({ use: Pet, database: db });

  usersRespo.save({ id: "123", pets: [{ id: "1", user_id: "123" }] });

  expect(petsRespo.query().getFirst().id).toBe("1");
});
