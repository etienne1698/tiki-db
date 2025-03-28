import type Model from "./Model";
import type Repository from "./Repository";

export default class QueryBuilder<M extends Model> {
  private declare repository: Repository<M>;
  private withRelated: string[] = [];

  constructor(repository: Repository<M>) {
    this.repository = repository;
  }

  with(...relations: string[]) {
    console.error(relations);
    return this;
  }

  get() {
    return Object.values(this.repository.state.value || []);
  }
}
