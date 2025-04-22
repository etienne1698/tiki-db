import { expect, test } from "vitest";
import { InMemoryStorage } from "../src/storage/in_memory_storage";
import { getTestDatabase } from "./base";

const storage = new InMemoryStorage();

test("simple insert and retrieve", () => {
  const { db, collections } = getTestDatabase(storage);

  db.storage.insert(collections.users, { id: "1", firstname: "Etienne" });

  expect(
    db.query(collections.users, { filters: { id: { $eq: '"1"' } } }).findFirst()
      .firstname
  ).toBe("Etienne");
});
