export function SimpleTestsTemplate(
  isAsyncStorage: boolean
) {
  return `
import { expect, test } from "vitest";
import { getTestDatabase } from "./base";

test("simple insert and retrieve", async () => {
  const { db } = getTestDatabase();

  ${isAsyncStorage ? 'await' : ''} db.collections.users.insert({ id: "1", firstname: "Etienne" });

  expect(
    (${isAsyncStorage ? 'await' : ''} db.collections.users.findFirst({ filters: { id: { $eq: "1" } } }))
      .firstname
  ).toBe("Etienne");
});

    `;
}
