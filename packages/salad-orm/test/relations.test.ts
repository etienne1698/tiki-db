import { expect, test } from "vitest";

import { getTestDatabase } from "./base";
import { inMemoryStorage } from "../src";

const storage = inMemoryStorage();

test("has_many get query should work", () => {
  const { db } = getTestDatabase(storage);

  db.collections.users.save({ id: "123" });
  db.collections.posts.save({ id: "1", userId: "123" });

  expect(db.collections.users.findFirst({
    with: {
      posts: true,
    }
  }).posts[0].id).toBe("1");
});
