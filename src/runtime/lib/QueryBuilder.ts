import type Model from "./Model";
import type Repository from "./Repository";

export default class QueryBuilder<M extends Model> {
  #repository!: Repository<M>;
  #withRelated = new Set<string>();

  #filters = {
    eq: {} as { [key: string]: any },
    ne: {} as { [key: string]: any },
    in: {} as { [key: string]: any },
  };

  constructor(repository: Repository<M>) {
    this.#repository = repository;
  }

  with(...relations: string[]) {
    relations.forEach(this.#withRelated.add);
    return this;
  }

  whereEq(field: string, value: any) {
    this.#filters.eq[field] = value;
    return this;
  }

  whereNe(field: string, value: any) {
    this.#filters.ne[field] = value;
    return this;
  }

  whereIn(field: string, value: any) {
    this.#filters.in[field] = value;
    return this;
  }

  get() {
    return Object.values(this.#repository.state.value || []);
  }
}
