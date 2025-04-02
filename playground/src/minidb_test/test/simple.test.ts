import { expect, test } from "vitest";

import { Database, hasMany, Model, model, string } from "../index";
import type { Query } from "../query";

test("test", () => {
  const pet = model({
    id: string("id", ""),
    user_id: string("user_id", ""),
  });

  const user = model(
    {
      id: string("id", ""),
    },
    () => ({
      pets: hasMany(pet, "user_id"),
    })
  );

  class DBImpl<
  Models extends Record<string, Model> = Record<string, Model>
> extends Database<Models> {
    get<M extends Model>(_model: Model, _query?: Query): M[] {
      return [];
    }
  }
  const db = new DBImpl({
    user,
    pet,
  });

  db.query(user).with('pets')

  return expect(db.models.user.relations().pets.field).toBe("user_id");
});
