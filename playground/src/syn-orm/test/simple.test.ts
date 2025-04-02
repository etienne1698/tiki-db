import { expect, test } from "vitest";

import { hasMany, model, string, createDatabase } from "../index";

test("test", () => {
  const pet = model("pets", {
    id: string("id", "").notNull(),
    user_id: string("user_id", ""),
  });

  const user = model(
    "users",
    {
      id: string("id", ""),
    },
    {
      relations: () => ({
        pets: hasMany(pet, "user_id"),
      }),
    }
  );

  const db = createDatabase(
    {
      user,
      pet,
    },
    // @ts-ignore
    {
      load() {}
    }
  );

  db.collections.pet.query().where('user_id', '$ne', '')

  return expect(db.collections.user.relations.pets.field).toBe("user_id");
});
