import type Model from "./Model";
import type Repository from "./Repository";

export type OperatorValueType = {
  $eq: any;
  $in: Array<any>;
  $ne: any;
};

export type Operator = keyof OperatorValueType;

export default class QueryBuilder<M extends Model> {
  #repository!: Repository<M>;
  #withRelated = new Set<string>();

  #filters: Record<Operator, Record<string, any>> = {
    $eq: {},
    $in: {},
    $ne: {},
  };

  constructor(repository: Repository<M>) {
    this.#repository = repository;
  }

  with(...relations: string[]) {
    relations.forEach((r) => {
      this.#withRelated.add(r);
    });
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
    const relations = this.#repository.use.relations();
    console.error(relations);

    return data.map((model) => {
      for (const relation of this.#withRelated.values()) {
        model[relation] = [];
      }
      return model;
    });
  }

  get() {
    let result = Object.values(this.#repository.state.value || []);
    if (this.#withRelated.size > 0) {
      result = this.#loadRelated(result);
    }

    return result;
  }
}
