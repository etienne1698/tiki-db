import "fake-indexeddb/auto";
import {
  asyncDatabase,
  collection,
  DatabaseFullSchema,
  InferCollectionInsert,
  model,
  number,
  string,
} from "../../src";
import { IndexedDBStorage } from "../../src/storage/idb/idb_storage";

const numberOfUsers = 150_000;

export async function getTestDatabase() {
  const schema = {
    users: collection(
      model("usersDbName", {
        id: number("identifier"),
        firstname: string("firstname", ""),
      })
    ),
  };

  const storage = new IndexedDBStorage<DatabaseFullSchema<typeof schema>>({
    dbName: "myDB",
  });

  const db = asyncDatabase(schema, storage);
  await db.init();

  await storage.clearAll();

  async function seed() {
    const users: InferCollectionInsert<
      typeof schema.users,
      DatabaseFullSchema<typeof schema>
    >[] = [];
    for (let i = 0; i < numberOfUsers; i++) {
      users.push({
        id: i,
        firstname: "user-" + i,
      });
    }
    await db.collections.users.insertMany(users);
  }
  await seed();

  return {
    db,
  };
}

export async function getTestDatabaseWithIndex() {
  const schema = {
    users: collection(
      model(
        "usersDbName",
        {
          id: number("identifier"),
          firstname: string("firstname", ""),
        },
        {
          indexes: [
            {
              keyPath: "firstname",
              name: "firstname-index",
            },
          ],
        }
      )
    ),
  };

  const storage = new IndexedDBStorage<DatabaseFullSchema<typeof schema>>({
    dbName: "myDBWithIndexes",
  });

  const db = asyncDatabase(schema, storage);
  await db.init();

  await storage.clearAll();

  async function seed() {
    const users: InferCollectionInsert<
      typeof schema.users,
      DatabaseFullSchema<typeof schema>
    >[] = [];
    for (let i = 0; i < numberOfUsers; i++) {
      users.push({
        id: i,
        firstname: "user-" + i,
      });
    }
    await db.collections.users.insertMany(users);
  }
  await seed();

  return {
    db,
  };
}
