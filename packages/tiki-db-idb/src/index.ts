import { IDBPDatabase, openDB } from "idb";
import {
  AnyButMaybeT,
  CollectionSchema,
  Database,
  DatabaseFullSchema,
  InferCollectionUpdate,
  InferCollectionInsert,
  InferModelNormalizedType,
  QueryFilters,
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

  async init(database: Database): Promise<void> {
    this.abstractDatabase = database;
  }

  // TODO: insert relations
  async insert<C extends CollectionSchema>(
    collectionSchema: C,
    data: InferCollectionInsert<C, DBFullSchema>,
    saveRelations?: boolean
  ): Promise<InferModelNormalizedType<C["model"]>> {
    const db = await this.getDB();
    const tx = db.transaction(collectionSchema.model.dbName, "readwrite");
    const store = tx.objectStore(collectionSchema.model.dbName);

    await store.add(data);

    await tx.done;
    return data;
  }

  // TODO: insert relations
  async insertMany<C extends CollectionSchema>(
    collectionSchema: C,
    data: InferCollectionInsert<C, DBFullSchema>[],
    saveRelations?: boolean
  ): Promise<InferModelNormalizedType<C["model"]>[]> {
    const db = await this.getDB();
    const tx = db.transaction(collectionSchema.model.dbName, "readwrite");
    const store = tx.objectStore(collectionSchema.model.dbName);

    for (const d of data) {
      await store.add(data);
    }

    await tx.done;
    return data;
  }

  upsert<C extends CollectionSchema>(
    collectionSchema: C,
    data: InferCollectionUpdate<C, DBFullSchema>,
    saveRelations?: boolean
  ): Promise<InferModelNormalizedType<C["model"]> | undefined> {
    throw "Not implemented yet";
  }

  upsertMany<C extends CollectionSchema>(
    collectionSchema: C,
    data: InferCollectionUpdate<C, DBFullSchema>[],
    saveRelations?: boolean
  ): Promise<InferModelNormalizedType<C["model"]>[]> {
    throw "Not implemented yet";
  }

  // TODO: filter + add relations
  async findMany<
    C extends CollectionSchema,
    Q extends Query<C, DBFullSchema> = Query<C, DBFullSchema>
  >(
    collectionSchema: C,
    query?: Q | undefined
  ): Promise<QueryResult<C, DBFullSchema, Q>> {
    const db = await this.getDB();

    const tx = db.transaction(collectionSchema.model.dbName, "readonly");
    const store = tx.objectStore(collectionSchema.model.dbName);

    const all = await store.getAll();
    const filtered = all;

    return filtered;
  }

  // TODO: filter + add relations
  async findFirst<
    C extends CollectionSchema,
    Q extends Query<C, DBFullSchema> = Query<C, DBFullSchema>
  >(
    collectionSchema: C,
    query?: Q | undefined
  ): Promise<QueryResult<C, DBFullSchema, Q>[0]> {
    const db = await this.getDB();

    const tx = db.transaction(collectionSchema.model.dbName, "readonly");
    const store = tx.objectStore(collectionSchema.model.dbName);

    const all = await store.getAll();
    const filtered = all;

    return filtered[0];
  }

  remove<C extends CollectionSchema>(
    collectionSchema: C,
    queryFilters: QueryFilters<C>
  ): Promise<void> {
    throw "Not implemented yet";
  }

  update<C extends CollectionSchema>(
    collectionSchema: C,
    queryFilters: QueryFilters<C>,
    data: InferCollectionUpdate<C, DBFullSchema>
  ): Promise<InferModelNormalizedType<C["model"]> | undefined> {
    throw "Not implemented yet";
  }

  updateMany<C extends CollectionSchema>(
    collectionSchema: C,
    queryFilters: QueryFilters<C>,
    data: InferCollectionUpdate<C, DBFullSchema>
  ): Promise<InferModelNormalizedType<C["model"]>[]> {
    throw "Not implemented yet";
  }
}
