import type { CollectionSchema } from "../collection/collection_schema";
import { Database, DatabaseFullSchema } from "../database/database";
import { Storage } from "../storage/storage";
import type { DeepPartial, InferModelFieldName, Primary } from "../types";
import {
  createDefaultQuery,
  FILTER_OR,
  Filters,
  type FiltersValueType,
  type Query,
  type QueryFilters,
} from "./query";

export class QueryBuilder<
  IsAsync extends boolean ,
  C extends CollectionSchema,
  DBFullSchema extends DatabaseFullSchema = DatabaseFullSchema,
  S extends Storage<DBFullSchema, IsAsync> = Storage<DBFullSchema, IsAsync>,
  D extends Database<IsAsync, DBFullSchema, S> = Database<IsAsync, DBFullSchema, S>
> {
  declare query: Query<C, DBFullSchema>;

  constructor(
    public database: D,
    public collection: C,
    query?: DeepPartial<Query<C, DBFullSchema>>
  ) {
    this.query = Object.assign(
      createDefaultQuery<C, DBFullSchema>(),
      query
    );
  }

  orWhere(ors: QueryFilters<C>[]) {
    if (!this.query.filters) this.query.filters = {}
    this.query.filters[FILTER_OR] = ors;
    return this;
  }

  where<T extends keyof FiltersValueType>(
    field: InferModelFieldName<C["model"]>,
    op: T,
    value: FiltersValueType[T]
  ) {
    if (!this.query.filters) this.query.filters = {}
    if (!this.query.filters[field]) {
      // @ts-ignore
      this.query.filters[field] = {};
      if (!this.query.filters[field][op]) {
        this.query.filters[field][op] = {} as any;
      }
    }
    this.query.filters[field][op] =
      value as FiltersValueType[keyof FiltersValueType];
    return this;
  }

  whereEq(
    field: InferModelFieldName<C["model"]>,
    value: FiltersValueType[Filters.EQ]
  ) {
    return this.where(field, Filters.EQ, value);
  }

  whereNe(
    field: InferModelFieldName<C["model"]>,
    value: FiltersValueType[Filters.NE]
  ) {
    return this.where(field, Filters.NE, value);
  }

  whereIn(
    field: InferModelFieldName<C["model"]>,
    value: FiltersValueType[Filters.IN]
  ) {
    return this.where(field, Filters.IN, value);
  }

  findMany() {
    return this.database.storage.findMany(this.collection, this.query);
  }

  findFirst() {
    return this.database.storage.findFirst(this.collection, this.query);
  }
}
