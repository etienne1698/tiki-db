import type { Model } from "./Model";
import type { Repository } from "./Repository";
import type { RelationsOf } from "./types";

export type OperatorValueType = {
  $eq: any;
  $in: Array<any>;
  $ne: any;
};

export type Operator = keyof OperatorValueType;

export class QueryBuilder<M extends Model> {
  #repository!: Repository<M>;
  #withRelated = new Set<string>();

  #filters: Record<Operator, Record<string, any>> = {
    $eq: {},
    $in: {},
    $ne: {},
  };

  #fnFilters: Array<(m: M) => boolean> = [];

  constructor(repository: Repository<M>) {
    this.#repository = repository;
  }

  with(...relations: RelationsOf<M>[]) {
    relations.forEach((r) => {
      this.#withRelated.add(r);
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
    this.#filters[op][field] = value;
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
    const modelRelations = this.#repository.use.relations();
    return data.map((model) => {
      const m = model.$clone();
      for (const relation of this.#withRelated.values()) {
        m[relation] = modelRelations[relation].getFor(
          model,
          this.#repository.database
        );
      }
      return m;
    });
  }

  #applyFilters(data: M[]) {
    for (const filter of this.#fnFilters) {
      data = data.filter(filter);
    }
    for (const [key, value] of Object.entries(this.#filters.$eq)) {
      // @ts-ignore
      data = data.filter((model) => model[key] == value);
    }
    for (const [key, value] of Object.entries(this.#filters.$in)) {
      // @ts-ignore
      data = data.filter((model) => model[key].includes(value));
    }
    for (const [key, value] of Object.entries(this.#filters.$ne)) {
      // @ts-ignore
      data = data.filter((model) => model[key] != value);
    }
    return data;
  }

  get() {
    let result = Object.values(this.#repository.state.value || []);
    if (this.#withRelated.size > 0) {
      result = this.#loadRelated(result);
    }
    result = this.#applyFilters(result);

    return result;
  }

  getFirst() {
    return this.get()[0];
  }
}
