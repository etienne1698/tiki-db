import { expect, test } from "vitest";
import { getTestDatabase } from "./base";
import { nextTick } from "vue";

test("test rerun query on insert", async () => {
  const { db } = await getTestDatabase();

  const queryResult = await db.collections.users.findFirst({});

  expect(queryResult.value).toBe(undefined);

  await db.collections.users.insert({ id: "1", firstname: "Etienne" });

  await nextTick();

  expect(queryResult.value.firstname).toBe("Etienne");
});

test("test rerun query on insertMany", async () => {
  const { db } = await getTestDatabase();

  const queryResult = await db.collections.users.findFirst({});

  expect(queryResult.value).toBe(undefined);

  await db.collections.users.insertMany([
    { id: "1", firstname: "Etienne" },
    { id: "2", firstname: "Geoffroy" },
  ]);

  await nextTick();

  expect(queryResult.value.firstname).toBe("Etienne");
});

test("test rerun query on remove", async () => {
  const { db } = await getTestDatabase();

  const queryResult = await db.collections.users.findFirst({});

  await db.collections.users.insert({ id: "1", firstname: "Etienne" });
  expect(queryResult.value.firstname).toBe("Etienne");

  await nextTick();

  await db.collections.users.remove({ id: { $eq: "1" } });

  await nextTick();

  expect(queryResult.value).toBe(undefined);
});
