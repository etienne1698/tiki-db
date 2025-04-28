import { expect, test } from "vitest";
import { getTestDatabase } from "../base";

test("insert with relation hasMany should insert relation", async () => {
  const { db } = getTestDatabase();

  (await db.collections.users.insert({
    id: "1",
    firstname: "Etienne",
    relatedPosts: [{ id: "123", title: "post 1" }],
  }));

  expect((await db.collections.posts.findFirst({})).id).toBe("123");
});

test("query with hasMany should return data with related data", async () => {
  const { db } = getTestDatabase();

  (await db.collections.users.insert({
    id: "1",
    firstname: "Etienne",
    relatedPosts: [{ id: "123", title: "post 1" }],
  }));

  expect(
    (await db.collections.posts.findFirst({ with: { relatedUser: true } })).relatedUser!
      .id
  ).toBe("1");
});