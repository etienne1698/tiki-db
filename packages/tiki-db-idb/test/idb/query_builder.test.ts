import { expect, test } from "vitest";
import { getTestDatabase } from "./base";

test("QueryBuilder should return same as direct query", async () => {
  const { db } = getTestDatabase();

  await db.collections.users.insert([
    { id: "1", firstname: "Etienne" },
    { id: "2", firstname: "Geoffroy" },
  ]);

  expect(
    await db.collections.users.findFirst({
      filters: {
        id: {
          $eq: "2",
        },
      },
    }).firstname
  ).toBe(await db.collections.users.query().whereEq("id", "2").findFirst().firstname);
});
