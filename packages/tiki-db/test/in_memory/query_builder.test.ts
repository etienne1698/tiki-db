import { expect, test } from "vitest";
import { getTestDatabase } from "./base";

test("QueryBuilder should return same as direct query", () => {
  const { db } = getTestDatabase();

  db.collections.users.insert({ id: "1", firstname: "Etienne" });
  db.collections.users.insert({ id: "2", firstname: "Geoffroy" });

  expect(
    db.collections.users.findFirst({
      filters: {
        id: {
          $eq: "2",
        },
      },
    }).firstname
  ).toBe(db.collections.users.query().whereEq("id", "2").findFirst().firstname);
});
