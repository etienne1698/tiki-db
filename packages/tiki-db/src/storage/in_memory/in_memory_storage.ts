import { CollectionSchema } from "../../collection/collection_schema";
import { Database, DatabaseFullSchema } from "../../database/database";
import { Query, QueryResult } from "../../query/query";
import { Primary, AnyButMaybeT, MaybeAsArray } from "../../types";
import { Storage } from "../storage";
import { InMemoryQueryFilter } from "./in_memory_query_filter";

export class InMemoryStorage<
  DBFullSchema extends DatabaseFullSchema = DatabaseFullSchema
> implements Storage<DBFullSchema>
{
  stores: { [key in keyof DBFullSchema["schema"]]: any } = {} as {
    [key in keyof DBFullSchema["schemaDbName"]]: Array<
      ReturnType<DBFullSchema["schemaDbName"][key]["model"]["normalize"]>
    >;
  };

  filtersManager = new InMemoryQueryFilter<DBFullSchema>();

  declare database: Database;

  async init(database: Database): Promise<void> {
    this.database = database;
    for (const collection of Object.values(database.schema.schema)) {
      // @ts-ignore
      this.stores[collection.model.dbName] = [];
    }
  }

  insert<C extends CollectionSchema>(
    collection: C,
    data: MaybeAsArray<AnyButMaybeT<ReturnType<C["model"]["normalize"]>>>,
    saveRelations?: boolean
  ): MaybeAsArray<ReturnType<C["model"]["normalize"]>> {
    if (Array.isArray(data)) {
      const allInserted: ReturnType<C["model"]["normalize"]>[] = [];
      for (const d of data) {
        const inserted = collection.model.normalize(d) as ReturnType<
          C["model"]["normalize"]
        >;
        if (saveRelations) {
          this.#saveRelations(collection, d);
        }
        this.stores[collection.model.dbName].push(inserted);
        allInserted.push(inserted);
      }
      return allInserted;
    } else {
      const inserted = collection.model.normalize(data);
      if (saveRelations) {
        this.#saveRelations(collection, data);
      }
      this.stores[collection.model.dbName].push(inserted);
      return inserted as ReturnType<C["model"]["normalize"]>;
    }
  }

  find<
    C extends CollectionSchema,
    Q extends Query<C, DBFullSchema> = Query<C, DBFullSchema>
  >(collection: C, query?: Q | undefined): QueryResult<C, DBFullSchema, Q> {
    return this.filtersManager.apply(
      this.stores[collection.model.dbName],
      query
    );
  }

  findFirst<
    C extends CollectionSchema,
    Q extends Query<C, DBFullSchema> = Query<C, DBFullSchema>
  >(collection: C, query?: Q | undefined) {
    return this.find(collection, query)?.[0];
  }

  remove<C extends CollectionSchema>(
    collection: C,
    primary: Primary,
    query?: Query<C, DBFullSchema> | undefined
  ): Partial<ReturnType<C["model"]["normalize"]>> | undefined {
    throw new Error("Method not implemented.");
  }

  update<C extends CollectionSchema>(
    collection: C,
    primary: Primary,
    data: AnyButMaybeT<ReturnType<C["model"]["normalize"]>>,
    query?: Query<C, DBFullSchema> | undefined
  ): Partial<ReturnType<C["model"]["normalize"]>> | undefined {
    throw new Error("Method not implemented.");
  }

  // TODO: upsert (not insert)
  #saveRelations<C extends CollectionSchema>(collection: C, data: any) {
    for (const relationKey in collection.relations.schema) {
      if (!data?.[relationKey]) continue;

      const relation = collection.relations.schema[relationKey];
      const relationCollection =
        this.database.schema.schemaDbName[relation.related.dbName];

      if (relation.multiple && Array.isArray(data[relationKey])) {
        this.insert(relationCollection, data[relationKey]);
      } else {
        this.insert(relationCollection, data[relationKey]);
      }
    }
  }
}
