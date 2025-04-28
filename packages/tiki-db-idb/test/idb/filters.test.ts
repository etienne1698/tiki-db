import { expect, test } from "vitest";
import { getTestDatabase } from "./base";

test("$eq should work", async () => {
  const { db } = getTestDatabase();

  (await db.collections.users.insert({ id: "1", firstname: "Etienne" }));

  expect(
    (await db.collections.users.findFirst({ filters: { id: { $eq: "1" } } })).firstname
  ).toBe("Etienne");
});

test("bad $eq request should not retrieve obj", async () => {
  const { db } = getTestDatabase();

  (await db.collections.users.insert({ id: "1", firstname: "Etienne" }));

  expect(
    (await db.collections.users.findFirst({ filters: { id: { $eq: "2" } } }))?.firstname
  ).toBe(undefined);
});

test("$in should work", async () => {
  const { db } = getTestDatabase();

  (await db.collections.users.insert([
    { id: "1", firstname: "Etienne" },
    { id: "2", firstname: "Geoffroy" },
    { id: "3", firstname: "Marc" },
  ]));

  expect(
    (await db.collections.users.find({ filters: { id: { $in: ["1", "2"] } } }))
  ).toContainEqual({ id: "2", firstname: "Geoffroy" });

  expect(
    (await db.collections.users.find({ filters: { id: { $in: ["1", "2"] } } }))
  ).toContainEqual({ id: "1", firstname: "Etienne" });

  expect(
    (await db.collections.users.find({ filters: { id: { $in: ["1", "2"] } } }))
  ).length(2);
});

test("$ne should work", async () => {
  const { db } = getTestDatabase();

  (await db.collections.users.insert([
    { id: "1", firstname: "Etienne" },
    { id: "2", firstname: "Geoffroy" },
    { id: "3", firstname: "Marc" },
  ]));

  expect(
    (await db.collections.users.find({ filters: { id: { $ne: "2" } } }))
  ).not.toContainEqual({ id: "2", firstname: "Geoffroy" });
});

test("$notIn should work", async () => {
  const { db } = getTestDatabase();

  (await db.collections.users.insert([
    { id: "1", firstname: "Etienne" },
    { id: "2", firstname: "Geoffroy" },
    { id: "3", firstname: "Marc" },
  ]));

  expect(
    (await db.collections.users.find({ filters: { id: { $notIn: ["1", "3"] } } }))
  ).toContainEqual({ id: "2", firstname: "Geoffroy" });

  expect(
    (await db.collections.users.find({ filters: { id: { $notIn: ["1", "3"] } } }))
  ).length(1);
});
