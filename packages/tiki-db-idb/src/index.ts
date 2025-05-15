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

// TODO: filter with indexes
export class IndexedDBStorage<DBFullSchema extends DatabaseFullSchema>
  implements Storage<DBFullSchema, true>
{
  public db?: IDBPDatabase;
  private declare dbName: string;
  private version = 1;

  private declare abstractDatabase: Database;

  constructor(opts?: { dbName: string }) {
    this.dbName = opts?.dbName || "TikiDB";
  }

  async clear<C extends CollectionSchema>(c: C) {
    const db = await this.getDB();
    db.clear(c.model.dbName);
  }

  async clearAll() {
    const db = await this.getDB();
    for (const c of Object.values(this.abstractDatabase.collections)) {
      db.clear(c.schema.model.dbName);
    }
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
    await this.#saveRelations(collectionSchema, data);

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
      await store.add(d);
      await this.#saveRelations(collectionSchema, d);
    }

    await tx.done;
    return data;
  }

  async upsert<C extends CollectionSchema>(
    collectionSchema: C,
    data: InferCollectionUpdate<C, DBFullSchema>,
    saveRelations?: boolean
  ): Promise<InferModelNormalizedType<C["model"]> | undefined> {
    const result = await this.update(
      collectionSchema,
      collectionSchema.model.getFilterByPrimary(data),
      data
    );
    return result || await this.insert(collectionSchema, data, saveRelations);
  }

  async upsertMany<C extends CollectionSchema>(
    collectionSchema: C,
    data: InferCollectionUpdate<C, DBFullSchema>[],
    saveRelations?: boolean
  ): Promise<InferModelNormalizedType<C["model"]>[]> {
    return (
      await Promise.all(
        data.map((d) => this.upsert(collectionSchema, d, saveRelations))
      )
    ).filter((d) => d != undefined);
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

  async remove<C extends CollectionSchema>(
    collectionSchema: C,
    queryFilters: QueryFilters<C>
  ): Promise<void> {
    const toRemove = await this.findFirst(collectionSchema, queryFilters);
    if (!toRemove) return undefined;

    const db = await this.getDB();
    const tx = db.transaction(collectionSchema.model.dbName, "readwrite");
    const store = tx.objectStore(collectionSchema.model.dbName);

    await store.delete(collectionSchema.model.primary(toRemove));

    await tx.done;
  }

  async update<C extends CollectionSchema>(
    collectionSchema: C,
    queryFilters: QueryFilters<C>,
    data: InferCollectionUpdate<C, DBFullSchema>
  ): Promise<InferModelNormalizedType<C["model"]> | undefined> {
    const toUpdate = await this.findFirst(collectionSchema, queryFilters);
    if (!toUpdate) return undefined;

    const db = await this.getDB();
    const tx = db.transaction(collectionSchema.model.dbName, "readwrite");
    const store = tx.objectStore(collectionSchema.model.dbName);

    const updated = { ...toUpdate, ...data };
    await store.put(updated);

    await tx.done;
    return updated;
  }

  async updateMany<C extends CollectionSchema>(
    collectionSchema: C,
    queryFilters: QueryFilters<C>,
    data: InferCollectionUpdate<C, DBFullSchema>
  ): Promise<InferModelNormalizedType<C["model"]>[]> {
    const toUpdate = await this.findMany(collectionSchema, queryFilters);
    if (!toUpdate.length) return [];

    const db = await this.getDB();
    const tx = db.transaction(collectionSchema.model.dbName, "readwrite");
    const store = tx.objectStore(collectionSchema.model.dbName);

    const result = [];
    for (const toUp of toUpdate) {
      const updated = { ...toUp, ...data };
      await store.put(updated);
      result.push(updated);
    }

    await tx.done;
    return result;
  }

  async #saveRelations<C extends CollectionSchema>(
    collectionSchema: C,
    data: any
  ) {
    for (const relationKey in collectionSchema.relations.schema) {
      if (!data?.[relationKey]) continue;

      const relation = collectionSchema.relations.schema[relationKey];
      const relationCollectionSchemaSchema =
        this.abstractDatabase.schema.schemaDbName[relation.related.dbName];

      if (Array.isArray(data[relationKey])) {
        if (relation.multiple) {
          await this.upsertMany(
            relationCollectionSchemaSchema,
            data[relationKey]
          );
        }
      } else {
        await this.upsert(relationCollectionSchemaSchema, data[relationKey]);
      }
    }
  }
}
