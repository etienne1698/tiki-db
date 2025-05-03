import { expect, test } from "vitest";
import { getTestDatabase } from "./base";

test("simple insert and retrieve", () => {
  const { db } = getTestDatabase();

  db.collections.users.insert({ id: "1", firstname: "Etienne" });

  expect(db.collections.users.findMany({})[0].firstname).toBe("Etienne");
});

test("simple insertMany and retrieve", () => {
  const { db } = getTestDatabase();

  db.collections.users.insertMany([
    { id: "1", firstname: "Etienne" },
    { id: "2", firstname: "Geoffroy" },
  ]);

  expect(
    db.collections.users
      .findMany({})
      .map((u) => u.firstname)
      .join(" ")
  ).toBe("Etienne Geoffroy");
});

test("simple update", () => {
  const { db } = getTestDatabase();

  db.collections.users.insert({ id: "1", firstname: "Etienne" });
  db.collections.users.update({ id: { $eq: "1" } }, { firstname: "Marc" });

  expect(db.collections.users.findMany({})[0].firstname).toBe("Marc");
});

test("simple updateMany", () => {
  const { db } = getTestDatabase();

  db.collections.users.insertMany([
    { id: "1", firstname: "Etienne" },
    { id: "2", firstname: "Geoffroy" },
  ]);
  db.collections.users.updateMany({}, { firstname: "Marc" });

  expect(
    db.collections.users
      .findMany({})
      .map((u) => u.firstname)
      .join(" ")
  ).toBe("Marc Marc");
});

test("simple remove", () => {
  const { db } = getTestDatabase();

  db.collections.users.insert({ id: "1", firstname: "Etienne" });
  db.collections.users.remove({ id: { $eq: "1" } });

  expect(db.collections.users.findFirst({})).toBe(undefined);
});
