import { expect, test } from "vitest";
import { getTestDatabase } from "./base";
import { nextTick } from "vue";

test("test rerun query on insert", async () => {
  const { db } = getTestDatabase();

  const queryResult = db.collections.users.findFirst({});

  expect(queryResult.value).toBe(undefined);

  db.collections.users.insert({ id: "1", firstname: "Etienne" });

  await nextTick();

  expect(queryResult.value.firstname).toBe("Etienne");
});

test("test rerun query on remove", async () => {
  const { db } = getTestDatabase();

  const queryResult = db.collections.users.findFirst({});

  db.collections.users.insert({ id: "1", firstname: "Etienne" });
  expect(queryResult.value.firstname).toBe("Etienne");

  await nextTick();

  db.collections.users.remove({ id: { $eq: "1" } });

  await nextTick();

  expect(queryResult.value).toBe(undefined);
});
