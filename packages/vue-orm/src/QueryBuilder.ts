import { Database } from "./Database";
import { Model } from "./Model";
import { OperatorValueType, Query, QueryType } from "./Query";
import type { Repository } from "./Repository";
import type { ModelConstructor, RelationsOf } from "./types";

export class QueryBuilder<M extends Model> {
  #database!: Database;
  #model!: ModelConstructor<M>;

  declare query: Query;

  #fnFilters: Array<(m: M) => boolean> = [];

  constructor(database: Database, model: ModelConstructor<M>, type: QueryType) {
    this.#database = database;
    this.#model = model;
    this.query = {
      filters: {
        $eq: {},
        $in: {},
        $ne: {},
      },
      withRelated: new Set<string>(),
      type,
    };
  }

  with(...relations: RelationsOf<M>[]) {
    relations.forEach((r) => {
      this.query.withRelated.add(r);
    });
    return this;
  }

  filter(f: (m: M) => boolean) {
    this.#fnFilters.push(f);
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

  #loadRelated(data: M[]) {
    const modelRelations = this.#model.relations();
    return data.map((model) => {
      const m = model.$clone();
      for (const relation of this.query.withRelated.values()) {
        m[relation] = modelRelations[relation].getFor(model, this.#database);
      }
      return m;
    });
  }

  #applyFilters(data: M[]) {
    for (const filter of this.#fnFilters) {
      data = data.filter(filter);
    }
    for (const [key, value] of Object.entries(this.query.filters.$eq)) {
      // @ts-ignore
      data = data.filter((model) => model[key] == value);
    }
    for (const [key, value] of Object.entries(this.query.filters.$in)) {
      // @ts-ignore
      data = data.filter((model) => model[key].includes(value));
    }
    for (const [key, value] of Object.entries(this.query.filters.$ne)) {
      // @ts-ignore
      data = data.filter((model) => model[key] != value);
    }
    return data;
  }

  get() {
    const state = this.#database.getStore<M>(this.#model.entity);
    let result = Object.values(state.value || []);
    result = this.#applyFilters(result);
    if (this.query.withRelated.size > 0) {
      result = this.#loadRelated(result);
    }

    return result;
  }

  getFirst() {
    return this.get()[0];
  }
}
