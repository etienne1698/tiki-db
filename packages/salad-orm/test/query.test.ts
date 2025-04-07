import { expect, test } from "vitest";

import { getTestDatabase } from "./base";
import { InMemoryStorage } from "../src";

const storage = InMemoryStorage;

test("Direct Query and Query through QueryBuilder should return same result", () => {
  const { db } = getTestDatabase(storage);

  expect(
    db.collections.users.find({
      filters: {
        $or: [
          {
            id: {
              $eq: "123",
            },
            firstname: { $eq: "John" },
          },
          { lastname: { $eq: "Doe" } },
        ],
        email: {
          $eq: "john.doe@mail.com",
        },
      },
    })
  ).toStrictEqual(
    db.collections.users
      .query()
      .orWhere([
        db.collections.users
          .query()
          .whereEq("id", "123")
          .whereEq("firstname", "John").query.filters,
        db.collections.users.query().whereEq("lastname", "Doe").query.filters,
      ])
      .whereEq("email", "john.doe@mail.com")
      .find()
  );
});
