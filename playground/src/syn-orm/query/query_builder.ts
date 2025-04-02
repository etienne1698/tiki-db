import type { Database } from "../database/database";
import type { Model, RelationsOf } from "../model/model";
import type { InferModelFieldName, Primary } from "../types";
import { Operator, type OperatorValueType, type Query } from "./query";

export class QueryBuilder<M extends Model, D extends Database> {
  declare query: Query<M>;

  constructor(public database: D, public model: M) {
    this.database = database;
    this.model = model;
    this.query = {
      filters: {
        [Operator.EQ]: {},
        [Operator.IN]: {},
        [Operator.NE]: {},
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
    field: InferModelFieldName<M>,
    op: T,
    value: OperatorValueType[T]
  ) {
    this.query.filters[op][field] =
      value as OperatorValueType[keyof OperatorValueType];
    return this;
  }

  whereEq(field: InferModelFieldName<M>, value: any) {
    return this.where(field, Operator.EQ, value);
  }

  whereNe(field: InferModelFieldName<M>, value: any) {
    return this.where(field, Operator.NE, value);
  }

  whereIn(field: InferModelFieldName<M>, value: Array<any>) {
    return this.where(field, Operator.IN, value);
  }

  get() {
    return this.database.store.get(this.model, this.query);
  }

  getFirst() {
    return this.get()?.[0];
  }
}
