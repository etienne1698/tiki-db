import { expect, test } from "vitest";
import { getTestDatabase } from "./base";

test("$eq should work", () => {
  const { db } = getTestDatabase();

  db.collections.users.insert({ id: "1", firstname: "Etienne" });

  expect(
    db.collections.users.findFirst({ filters: { id: { $eq: "1" } } }).firstname
  ).toBe("Etienne");
});

test("bad $eq request should not retrieve obj", () => {
  const { db } = getTestDatabase();

  db.collections.users.insert({ id: "1", firstname: "Etienne" });

  expect(
    db.collections.users.findFirst({ filters: { id: { $eq: "2" } } })?.firstname
  ).toBe(undefined);
});

test("$in should work", () => {
  const { db } = getTestDatabase();

  db.collections.users.insert({ id: "1", firstname: "Etienne" });
  db.collections.users.insert({ id: "2", firstname: "Geoffroy" });
  db.collections.users.insert({ id: "3", firstname: "Marc" });

  expect(
    db.collections.users.find({ filters: { id: { $in: ["1", "2"] } } })
  ).toContainEqual({ id: "2", firstname: "Geoffroy" });

  expect(
    db.collections.users.find({ filters: { id: { $in: ["1", "2"] } } })
  ).toContainEqual({ id: "1", firstname: "Etienne" });

  expect(
    db.collections.users.find({ filters: { id: { $in: ["1", "2"] } } })
  ).length(2);
});

test("$ne should work", () => {
  const { db } = getTestDatabase();

  db.collections.users.insert({ id: "1", firstname: "Etienne" });
  db.collections.users.insert({ id: "2", firstname: "Geoffroy" });
  db.collections.users.insert({ id: "3", firstname: "Marc" });

  expect(
    db.collections.users.find({ filters: { id: { $ne: "2" } } })
  ).not.toContainEqual({ id: "2", firstname: "Geoffroy" });
});

test("$notIn should work", () => {
  const { db } = getTestDatabase();

  db.collections.users.insert({ id: "1", firstname: "Etienne" });
  db.collections.users.insert({ id: "2", firstname: "Geoffroy" });
  db.collections.users.insert({ id: "3", firstname: "Marc" });

  expect(
    db.collections.users.find({ filters: { id: { $notIn: ["1", "3"] } } })
  ).toContainEqual({ id: "2", firstname: "Geoffroy" });

  expect(
    db.collections.users.find({ filters: { id: { $notIn: ["1", "3"] } } })
  ).length(1);
});
