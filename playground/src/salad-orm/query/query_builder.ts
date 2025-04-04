import type { Collection } from "../collection/collection";
import type { Storage } from "../storage/storage";
import type { InferModelFieldName, Primary } from "../types";
import {
  AndOrFilters,
  createDefaultQuery,
  FILTER_OR,
  Filters,
  type FiltersValueType,
  type Query,
  type QueryFilters,
} from "./query";

export class QueryBuilder<C extends Collection> {
  declare query: Query<C>;

  constructor(public storage: Storage, public collection: C, query?: Query<C>) {
    this.storage = storage;
    this.collection = collection;
    this.query = query || createDefaultQuery<C>();
  }

  with<K extends keyof C["relations"]["schema"]>(...relations: K[]) {
    relations.forEach((r) => {
      this.query.with.add(r as string);
    });
    return this;
  }

  byPrimary(primaries: Primary[]) {
    primaries.forEach((primary) => {
      this.query.primaries.push(primary);
    });
    return this;
  }

  orWhere(ors: QueryFilters<C>[]) {
    this.query.filters[FILTER_OR] = ors;
    return this;
  }

  where<T extends keyof FiltersValueType>(
    field: InferModelFieldName<C["model"]>,
    op: T,
    value: FiltersValueType[T]
  ) {
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

  find() {
    return this.storage.get(this.collection, this.query);
  }

  findFirst() {
    return this.find()?.[0];
  }
}
