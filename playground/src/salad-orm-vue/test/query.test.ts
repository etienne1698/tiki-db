import { expect, test } from "vitest";

import { getTestBase } from "./base";

test("Direct Query and Query through QueryBuild should return same result", () => {
  const { db } = getTestBase();

  expect(
    db.collections.users.$query({
      filters: {
        $or: {
          $and: {
            id: {
              $eq: "123",
            },
            firstname: { $eq: "John" },
          },
          lastname: { $eq: "Doe" },
        },
        email: {
          $eq: "john.doe@mail.com",
        },
      },
    })
  ).toBe(
    db.collections.users
      .query()
      .orWhere((qb) =>
        qb
          .andWhere((qb2) =>
            qb2.whereEq("id", "123").whereEq("firstname", "John")
          )
          .whereEq("lastname", "Doe")
      )
      .whereEq("email", "john.doe@mail.com")
      .get()
  );
});
