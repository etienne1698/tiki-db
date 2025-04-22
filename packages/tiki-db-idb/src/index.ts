import { IDBPDatabase, openDB } from "idb";
import {
  AnyButMaybeT,
  CollectionSchema,
  Database,
  DatabaseFullSchema,
  MaybeAsArray,
  Primary,
  Query,
  QueryResult,
  Storage,
} from "tiki-db";

export class IndexedDBStorage<DBFullSchema extends DatabaseFullSchema>
  implements Storage<DBFullSchema, true>
{
  private db?: IDBPDatabase;
  private dbName = "TikiDB";
  private version = 1;

  private declare abstractDatabase: Database;

  async init(database: Database): Promise<void> {
    this.abstractDatabase = database;
  }

  async insert<C extends CollectionSchema>(
    collection: C,
    data: MaybeAsArray<AnyButMaybeT<ReturnType<C["model"]["normalize"]>>>
  ): Promise<ReturnType<C["model"]["normalize"]>> {
    const db = await this.getDB();
    const tx = db.transaction(collection.model.dbName, "readwrite");
    const store = tx.objectStore(collection.model.dbName);

    const arrayData = Array.isArray(data) ? data : [data];
    for (const item of arrayData) {
      await store.put(item);
    }

    await tx.done;
    return arrayData[0];
  }

  async find<
    C extends CollectionSchema,
    Q extends Query<C, DBFullSchema> = Query<C, DBFullSchema>
  >(
    collection: C,
    query?: Q | undefined
  ): Promise<QueryResult<C, DBFullSchema, Q>> {
    const db = await this.getDB();

    const tx = db.transaction(collection.model.dbName, "readonly");
    const store = tx.objectStore(collection.model.dbName);

    const all = await store.getAll();
    const filtered = all;

    return filtered;
  }

  async findFirst<
    C extends CollectionSchema,
    Q extends Query<C, DBFullSchema> = Query<C, DBFullSchema>
  >(collection: C, query?: Q | undefined) {
    return (await this.find(collection, query))?.[0];
  }

  remove<C extends CollectionSchema>(
    collection: C,
    primary: Primary,
    query?: Query<C, DBFullSchema> | undefined
  ): Promise<Partial<ReturnType<C["model"]["normalize"]>> | undefined> {
    throw new Error("Method not implemented.");
  }
  update<C extends CollectionSchema>(
    collection: C,
    primary: Primary,
    data: AnyButMaybeT<ReturnType<C["model"]["normalize"]>>,
    query?: Query<C, DBFullSchema> | undefined
  ): Promise<Partial<ReturnType<C["model"]["normalize"]>> | undefined> {
    throw new Error("Method not implemented.");
  }

  insertRelations<C extends CollectionSchema>(
    collection: C,
    relation: keyof C["relations"],
    data: Record<string, any>
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getByPrimary<C extends CollectionSchema>(
    collection: C,
    primary: Primary
  ): Promise<ReturnType<C["model"]["normalize"]> | undefined> {
    throw new Error("Method not implemented.");
  }
  getByPrimaries<C extends CollectionSchema>(
    collection: C,
    primaries: Primary[]
  ): Promise<ReturnType<C["model"]["normalize"]>[]> {
    throw new Error("Method not implemented.");
  }

  async getDB() {
    if (!this.db) {
      const schema = this.abstractDatabase.schema.schema;

      this.db = await openDB(this.dbName, this.version, {
        upgrade(db) {
          for (const collection of Object.values(schema)) {
            if (!db.objectStoreNames.contains(collection.model.dbName)) {
              db.createObjectStore(collection.model.dbName, {
                keyPath: collection.model.primaryKey,
              });
            }
          }
        },
      });
    }
    return this.db;
  }
}
