import { expect, test } from "vitest";

import { getTestDatabase } from "./base";
import { DeepPartial, InMemoryStorage, Query, type QueryResult } from "../src";

const storage = InMemoryStorage;

test("has_many get query should work", async () => {
  const { db } = getTestDatabase(storage);

  db.collections.users.save({ id: "123" });
  db.collections.posts.save({ id: "1", userId: "123" });

  const res = await db.collections.users.findFirst({
    with: {
      posts: true,
    },
  });
  expect(res!.posts![0].id).toBe("1");
});


test("belongs_to get query should work", async () => {
  const { db } = getTestDatabase(storage);

  db.collections.users.save({ id: "123" });
  db.collections.posts.save({ id: "1", userId: "123" });

  const res = await db.collections.posts.findFirst({
    with: {
      userqs: true,
    },
  });
  expect(res!.userqs!.id).toBe("123");
});
