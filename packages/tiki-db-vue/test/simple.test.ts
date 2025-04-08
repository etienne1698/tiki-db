import { expect, test } from "vitest";

import { getTestDatabase } from "./base";
import { vueStorage } from "../src";

const storage = vueStorage();

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

/* test("has_many get query should work", () => {
  const { db } = getTestDatabase(storage);

  db.collections.users.save({ id: "123" });
  db.collections.posts.save({ id: "1", userId: "123" });
  
  expect(
    db.collections.users.query().with("posts").findFirst().posts[0].id
  ).toBe("1");
}); */

test("should be delete", () => {
  const { db } = getTestDatabase(storage);

  db.collections.users.save({ id: "123" });
  db.collections.users.delete("123");

  expect(db.collections.users.query().findFirst()).toBe(undefined);
});
