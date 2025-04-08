import { expect, test } from "vitest";

import { getTestDatabase } from "./base";
import { InMemoryStorage } from "../src";

const storage = InMemoryStorage;

test("simple save and retrieve", () => {
  const { db } = getTestDatabase(storage);

  db.collections.users.save({ id: "123" });

  expect(db.collections.users.query().findFirst().id).toBe("123");
});

test("relation should not be saved in entity state", () => {
  const { db } = getTestDatabase(storage);

  db.collections.users.save({ id: "123", posts: [{ id: "1", userId: "123" }] });

  expect(db.collections.users.query().findFirst().posts).toBe(undefined);
});

test("relation should be save to the relation entity state", () => {
  const { db } = getTestDatabase(storage);

  db.collections.users.save({ id: "123", posts: [{ id: "1", userId: "123" }] });

  expect(db.collections.posts.query().findFirst().id).toBe("1");
});

test("should be delete", () => {
  const { db } = getTestDatabase(storage);

  db.collections.users.save({ id: "123" });
  db.collections.users.delete("123");

  expect(db.collections.users.query().findFirst()).toBe(undefined);
});
