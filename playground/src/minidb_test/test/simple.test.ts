import { expect, test } from "vitest";

import { hasMany, model, string, createDatabase } from "../index";
import { collection } from "../database/collection";

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

  const db = createDatabase(
    {
      user,
      pet,
    },
    // @ts-ignore
    {    }
  );

  db.collections.user.save({id: true});
  collection(db, user).all().map(e => e.id)

  return expect(db.collections.user.relations.pets.field).toBe(
    "user_id"
  );
});
