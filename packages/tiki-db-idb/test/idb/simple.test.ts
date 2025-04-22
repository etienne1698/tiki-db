import { expect, test } from "vitest";
import { getTestDatabase } from "./base";

test("simple insert and retrieve", async () => {
  const { db } = getTestDatabase();

  await db.collections.users.insert({ id: "1", firstname: "Etienne" });

  expect(
    (
      await db.collections.users
        .query({ filters: { id: { $eq: '"1"' } } })
        .findFirst()
    ).firstname
  ).toBe("Etienne");
});
