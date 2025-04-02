import { expect, test } from "vitest";

import { Database, hasMany, model, string } from "../index";

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

  const db = new Database({
    user,
    pet,
  });

  return expect(db.models.user.relations().pets.field).toBe("user_id");
});
