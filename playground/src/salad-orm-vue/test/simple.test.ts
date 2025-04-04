import { expect, test } from "vitest";

import { getTestBase } from "./base";

test("simple save and retrieve", () => {
  const { db } = getTestBase();

  db.query.users.save({ id: "123" });

  expect(db.query.users.query().getFirst().id).toBe("123");
});

test("relation should not be saved in entity state", () => {
  const { db } = getTestBase();

  db.query.users.save({ id: "123", pets: [{ id: "1", user_id: "123" }] });

  expect(db.query.users.query().getFirst().pets).toBe(undefined);
});

test("relation should be save to the relation entity state", () => {
  const { db } = getTestBase();

  db.query.users.save({ id: "123", pets: [{ id: "1", user_id: "123" }] });

  expect(db.query.pets.query().getFirst().id).toBe("1");
});

test("has_many query should worke", () => {
  const { db } = getTestBase();

  db.query.users.save({ id: "123", pets: [{ id: "1", user_id: "123" }] });

  expect(db.query.users.query().with("pets").getFirst().pets[0].id).toBe(
    "1"
  );
});

test("should be delete", () => {
  const { db } = getTestBase();

  db.query.users.save({ id: "123" });
  db.query.users.delete("123");

  expect(db.query.users.query().getFirst()).toBe(undefined);
});
