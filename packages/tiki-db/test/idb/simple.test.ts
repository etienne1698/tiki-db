import { expect, test } from "vitest";
import { getTestDatabase } from "./base";

test("simple insert and retrieve", async () => {
  const { db } = await getTestDatabase();

  await db.collections.users.insert({ id: "1", firstname: "Etienne" });

  expect((await db.collections.users.findMany({}))[0].firstname).toBe(
    "Etienne"
  );
});

test("simple insertMany and retrieve", async () => {
  const { db } = await getTestDatabase();

  await db.collections.users.insertMany([
    { id: "1", firstname: "Etienne" },
    { id: "2", firstname: "Geoffroy" },
  ]);

  expect(
    (await db.collections.users.findMany({})).map((u) => u.firstname).join(" ")
  ).toBe("Etienne Geoffroy");
});

test("simple update", async () => {
  const { db } = await getTestDatabase();

  await db.collections.users.insert({ id: "1", firstname: "Etienne" });
  await db.collections.users.update(
    { id: { $eq: "1" } },
    { firstname: "Marc" }
  );

  expect((await db.collections.users.findMany({}))[0].firstname).toBe("Marc");
});

test("simple updateMany", async () => {
  const { db } = await getTestDatabase();

  await db.collections.users.insertMany([
    { id: "1", firstname: "Etienne" },
    { id: "2", firstname: "Geoffroy" },
  ]);
  await db.collections.users.updateMany({}, { firstname: "Marc" });

  expect(
    (await db.collections.users.findMany({})).map((u) => u.firstname).join(" ")
  ).toBe("Marc Marc");
});

test("simple remove", async () => {
  const { db } = await getTestDatabase();

  await db.collections.users.insert({ id: "1", firstname: "Etienne" });
  await db.collections.users.remove({ id: { $eq: "1" } });

  expect(await db.collections.users.findFirst({})).toBe(undefined);
});
