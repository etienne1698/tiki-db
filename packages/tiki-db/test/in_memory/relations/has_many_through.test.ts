import { expect, test } from "vitest";
import { getTestDatabase } from "../base";


test("insert with relation hasManyThrough should insert relation", () => {
  const { db } = getTestDatabase();

  db.collections.users.insert({
    id: "1",
    firstname: "Etienne",
    relatedComments: [{ id: "123" }],
  });

  expect(db.collections.comments.findFirst({}).id).toBe("123");
});
