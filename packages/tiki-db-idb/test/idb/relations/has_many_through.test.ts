import { expect, test } from "vitest";
import { getTestDatabase } from "../base";


test("insert with relation hasManyThrough should insert relation", async () => {
  const { db } = getTestDatabase();

  await db.collections.users.insert({
    id: "1",
    firstname: "Etienne",
    relatedComments: [{ id: "123" }],
  });

  expect(await db.collections.comments.findFirst({}).id).toBe("123");
});
