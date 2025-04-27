import { expect, test } from "vitest";
import { getTestDatabase } from "../base";


test("insert with relation belongsTo should insert relation", () => {
  const { db } = getTestDatabase();

  db.collections.posts.insert({
    id: "1",
    title: "post 1",
    relatedUser: { id: "123" },
  });

  expect(db.collections.users.findFirst({}).id).toBe("123");
});
