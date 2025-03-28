import type { Ref } from "vue";
import Model from "./Model";
import type { ModelConstructor, PrimaryKey } from "./types";
import QueryBuilder from "./QueryBuilder";
import Database from "./Database";

export default class Repository<M extends Model = Model> {
  declare use: ModelConstructor<M>;
  #state!: Ref<Record<PrimaryKey, M>>;
  #database!: Database;

  constructor() {
    this.#database = new Database();
    this.#state = this.#database.getStore(this.use.entity);
  }

  init() {
    if (
      Object.values(this.#state.value) &&
      !(Object.values(this.#state.value)[0] instanceof Model)
    ) {
      for (const key of Object.keys(this.#state.value)) {
        this.#state.value[key] = this.map(this.#state.value[key]);
      }
    }
  }

  map(data: Partial<M & Record<string, any>>) {
    return Object.assign(new this.use(), data);
  }

  save(data: Partial<M & Record<string, any>>) {
    const model = this.map(data);
    this.#state.value[model.$primaryKey()] = model;
    return model;
  }

  all() {
    return new QueryBuilder(this).get();
  }

  with(...relations: string[]) {
    return new QueryBuilder(this).with(...relations);
  }
}
