import type { Database } from "../database";
import type { Model, Primary, RelationsOf } from "../model";
import type { OperatorValueType, Query } from "./query";

export class QueryBuilder<M extends Model, D extends Database> {
  declare query: Query;

  constructor(public database: D, public model: M) {
    this.database = database;
    this.model = model;
    this.query = {
      filters: {
        $eq: {},
        $in: {},
        $ne: {},
      },
      with: new Set<string>(),
      primaries: [],
    };
  }

  with(...relations: RelationsOf<M>[]) {
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

  where<T extends keyof OperatorValueType>(
    field: string,
    op: T,
    value: OperatorValueType[T]
  ) {
    // @ts-ignore
    this.query.filters[op][field] = value;
    return this;
  }

  whereEq(field: string, value: any) {
    return this.where(field, "$eq", value);
  }

  whereNe(field: string, value: any) {
    return this.where(field, "$ne", value);
  }

  whereIn(field: string, value: Array<any>) {
    return this.where(field, "$in", value);
  }

  get() {
    return this.database.store.get(this.model, this.query);
  }
}
