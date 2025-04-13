import { expect, test } from "vitest";

import { getTestDatabase } from "./base";
import { InMemoryStorage } from "../src";

const storage = InMemoryStorage;

test("simple save and retrieve", async () => {
  const { db } = getTestDatabase(storage);

  await db.collections.users.save({ id: "123" });

  expect((await db.collections.users.query().findFirst()).id).toBe("123");
});

test("relation should not be saved in entity state", async () => {
  const { db } = getTestDatabase(storage);

  await db.collections.users.save({
    id: "123",
    posts: [{ id: "1", userId: "123" }],
  });

  expect((await db.collections.users.query().findFirst()).posts).toBe(
    undefined
  );
});

test("relation should be save to the relation entity state", async () => {
  const { db } = getTestDatabase(storage);

  await db.collections.users.save({
    id: "123",
    posts: [{ id: "1", userId: "123" }],
  });

  expect((await db.collections.posts.query().findFirst()).id).toBe("1");
});

test("should be delete", async () => {
  const { db } = getTestDatabase(storage);

  await db.collections.users.save({ id: "123" });
  await db.collections.users.delete("123");

  expect(await db.collections.users.query().findFirst()).toBe(undefined);
});
