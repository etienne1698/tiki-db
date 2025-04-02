import { expect, test } from "vitest";

import { hasMany, model, string, createDatabase } from "../index";

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
    {
      get: () => [],
    }
  );

  db.query(user).with("pets").get();

  return expect(db.models.user.relations().pets.field).toBe("user_id");
});
