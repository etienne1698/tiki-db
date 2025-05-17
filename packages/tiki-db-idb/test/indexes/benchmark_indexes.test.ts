import { expect, test } from "vitest";
import { getTestDatabase, getTestDatabaseWithIndex } from "./base";

test("benchmark indexes", async () => {
  const { db } = await getTestDatabase();
  const { db: dbWithIndexes } = await getTestDatabaseWithIndex();
  const query = {
    filters: { firstname: { $eq: "user-100000" } },
  };

  const runOnDB = async () => {
    const start = performance.now();
    await db.collections.users.findFirst(query);
    return performance.now() - start;
  };

  const runOnDBWithIndexes = async () => {
    const start = performance.now();
    await dbWithIndexes.collections.users.findFirst(query);
    return performance.now() - start;
  };

  const timeDb = await runOnDB();
  const timeDbWithIndexes = await runOnDBWithIndexes();

  expect(timeDbWithIndexes).toBeLessThan(timeDb);
});
