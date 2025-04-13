import { expect, test } from "vitest";

import { getTestDatabase } from "./base";
import { InMemoryStorage } from "../src";

const storage = InMemoryStorage;

test("has_many get query should work", async () => {
  const { db } = getTestDatabase(storage);

  db.collections.users.save({ id: "123" });
  db.collections.posts.save({ id: "1", userId: "123" });

  expect(
    (
      await db.collections.users.findFirst({
        with: {
          posts: true,
        },
      })
    ).posts[0].id
  ).toBe("1");
});
