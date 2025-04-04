import { expect, test } from "vitest";

import { getTestBase } from "./base";

test("simple save and retrieve", () => {
  const { db } = getTestBase();

  db.collections.users.save({ id: "123" });

  expect(db.collections.users.query().getFirst().id).toBe("123");
});

test("relation should not be saved in entity state", () => {
  const { db } = getTestBase();

  db.collections.users.save({ id: "123", posts: [{ id: "1", userId: "123" }] });

  expect(db.collections.users.query().getFirst().posts).toBe(undefined);
});

test("relation should be save to the relation entity state", () => {
  const { db } = getTestBase();

  db.collections.users.save({ id: "123", posts: [{ id: "1", userId: "123" }] });

  expect(db.collections.posts.query().getFirst().id).toBe("1");
});

test("has_many get query should worke", () => {
  const { db } = getTestBase();

  db.collections.users.save({ id: "123" });
  db.collections.posts.save({ id: "1", userId: "123" });

  expect(db.collections.users.query().with("posts").getFirst().posts[0].id).toBe(
    "1"
  );
});

test("should be delete", () => {
  const { db } = getTestBase();

  db.collections.users.save({ id: "123" });
  db.collections.users.delete("123");

  expect(db.collections.users.query().getFirst()).toBe(undefined);
});
