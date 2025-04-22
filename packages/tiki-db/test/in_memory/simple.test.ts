import { expect, test } from "vitest";
import { getTestDatabase } from "./base";

test("simple insert and retrieve", () => {
  const { db } = getTestDatabase();

  db.collections.users.insert({ id: "1", firstname: "Etienne" });

  expect(
    db.collections.users.findFirst({ filters: { id: { $eq: '"1"' } } })
      .firstname
  ).toBe("Etienne");
});
