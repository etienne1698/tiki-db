import { expect, test } from "vitest";
import { getTestDatabase } from "./base";

test("insert with relation 'one' should insert relation", () => {
  const { db } = getTestDatabase();

  db.collections.posts.insert({
    id: "1",
    title: "post 1",
    relatedUser: { id: "123" },
  });

  expect(db.collections.users.findFirst({}).id).toBe("123");
});

test("insert with relation 'many' should insert relation", () => {
  const { db } = getTestDatabase();

  db.collections.users.insert({
    id: "1",
    firstname: "Etienne",
    relatedPosts: [{ id: "123", title: "post 1" }],
  });

  expect(db.collections.posts.findFirst({}).id).toBe("123");
});

test("query with 'many' should return data with related data", () => {
  const { db } = getTestDatabase();

  db.collections.users.insert({
    id: "1",
    firstname: "Etienne",
    relatedPosts: [{ id: "123", title: "post 1", userId: "1" }],
  });

  expect(
    db.collections.posts.findFirst({ with: { relatedUser: true } }).relatedUser!
      .id
  ).toBe("1");
});

test("insert with 'many' 'createMissingRelatedFields' should work", () => {
  const { db } = getTestDatabase();

  db.collections.users.insert(
    {
      id: "1",
      firstname: "Etienne",
      relatedPosts: [{ id: "123", title: "post 1" }],
    },
    {
      createMissingRelatedFields: true,
    }
  );

  expect(db.collections.posts.findFirst({}).userId).toBe("1");
});

test("insert with 'one' 'createMissingRelatedFields' should work", () => {
  const { db } = getTestDatabase();

  db.collections.posts.insert(
    {
      id: "1",
      userId: "123",
      relatedUser: {
        firstname: "Etienne",
      },
    },
    {
      createMissingRelatedFields: true,
    }
  );

  expect(db.collections.users.findFirst({}).id).toBe("123");
});
