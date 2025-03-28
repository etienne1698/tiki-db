import type Model from "./Model";
import type Repository from "./Repository";

export default class QueryBuilder<M extends Model> {
  #repository!: Repository<M>;
  #withRelated = new Set<string>();

  constructor(repository: Repository<M>) {
    this.#repository = repository;
  }

  with(...relations: string[]) {
    relations.forEach((r) => this.#withRelated.add(r));
    return this;
  }

  get() {
    return Object.values(this.#repository.state.value || []);
  }
}
