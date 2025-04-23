import { CollectionSchema } from "../../collection/collection_schema";
import { Database, DatabaseFullSchema } from "../../database/database";
import {
  FILTER_OR,
  Filters,
  Query,
  QueryFilters,
  QueryResult,
} from "../../query/query";
import { Primary, AnyButMaybeT, MaybeAsArray } from "../../types";
import { Storage } from "../storage";

export class InMemoryStorage<
  DBFullSchema extends DatabaseFullSchema = DatabaseFullSchema
> implements Storage<DBFullSchema>
{
  stores: { [key in keyof DBFullSchema["schema"]]: any } = {} as {
    [key in keyof DBFullSchema["schemaDbName"]]: Array<
      ReturnType<DBFullSchema["schemaDbName"][key]["model"]["normalize"]>
    >;
  };

  #applyFilter<
    C extends CollectionSchema,
    Q extends Query<C, DBFullSchema> = Query<C, DBFullSchema>
  >(
    list: QueryResult<C, DBFullSchema, Q>,
    query?: Q | undefined
  ): QueryResult<C, DBFullSchema, Q> {
    if (!query) return list;

    if (query.filters[FILTER_OR]) {
    }
    for (const [field, filters] of Object.entries(query.filters)) {
      if (field === FILTER_OR || !filters) continue;
      for (const [filter, value] of Object.entries(filters)) {
        if (filter === Filters.EQ) {
          list = list.filter((obj) => obj[field] === value);
        }
        if (filter === Filters.IN) {
          list = list.filter((obj) => value.includes(obj[field]));
        }
        if (filter === Filters.NE) {
          list = list.filter((obj) => obj[field] !== value);
        }
      }
    }
    return list;
  }

  async init(database: Database): Promise<void> {
    for (const collection of Object.values(database.schema.schema)) {
      // @ts-ignore
      this.stores[collection.model.dbName] = [];
    }
  }

  insert<C extends CollectionSchema>(
    collection: C,
    data: MaybeAsArray<AnyButMaybeT<ReturnType<C["model"]["normalize"]>>>
  ): ReturnType<C["model"]["normalize"]> {
    const inserted = collection.model.normalize(data);
    this.stores[collection.model.dbName].push(inserted);
    return inserted as ReturnType<C["model"]["normalize"]>;
  }

  find<
    C extends CollectionSchema,
    Q extends Query<C, DBFullSchema> = Query<C, DBFullSchema>
  >(collection: C, query?: Q | undefined): QueryResult<C, DBFullSchema, Q> {
    return this.#applyFilter(this.stores[collection.model.dbName], query);
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

  insertRelations<C extends CollectionSchema>(
    collection: C,
    relation: keyof C["relations"],
    data: Record<string, any>
  ): void {
    throw new Error("Method not implemented.");
  }
}
