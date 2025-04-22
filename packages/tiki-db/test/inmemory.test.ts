import { expect, test } from "vitest";
import { InMemoryStorage } from "../src/storage/in_memory_storage";
import { getTestDatabase } from "./base";

const storage = new InMemoryStorage();

test("simple insert and retrieve", () => {
  const { db, collections } = getTestDatabase(storage);

  db.collections.users.insert({ id: "1", firstname: "Etienne" });

  expect(
    db.collections.users.query({ filters: { id: { $eq: '"1"' } } }).findFirst()
      .firstname
  ).toBe("Etienne");
});
