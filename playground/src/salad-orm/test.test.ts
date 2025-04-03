import { expect, test } from "vitest";
import { collection, database, relations, string } from ".";

const users = collection("users", {
  id: string("id", ""),
});

const pets = collection("pets", {
  id: string("id", ""),
  user_id: string("id", ""),
});

const usersRelations = relations(users, ({ hasMany }) => ({
  pets: hasMany(pets, "user_id"),
}));

const petsRelations = relations(pets, ({ belongsTo }) => ({
  user: belongsTo(users, "user_id"),
}));

const db = database({
  users,
  pets,
  usersRelations,
  petsRelations,
});

test("test", () => {
  console.error(db.schema.pets.relations)
  expect(db.schema.pets.dbName).toBe("pets");
});
