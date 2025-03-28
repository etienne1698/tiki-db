import type { Ref } from "vue";
import Model from "./Model";
import type { MaybeAsArray, ModelConstructor, PrimaryKey } from "./types";
import QueryBuilder from "./QueryBuilder";
import type Database from "./Database";

export default class Repository<M extends Model = Model> {
  declare use: ModelConstructor<M>;
  declare state: Ref<Record<PrimaryKey, M>>;
  declare database: Database;

  constructor(database: Database) {
    this.database = database;
  }

  init() {
    this.state = this.database.getStore(this.use.entity);

    if (
      Object.values(this.state.value) &&
      !(Object.values(this.state.value)[0] instanceof Model)
    ) {
      for (const key of Object.keys(this.state.value)) {
        this.state.value[key] = this.map(this.state.value[key]);
      }
    }
  }

  map(data: Partial<M & Record<string, any>>) {
    return Object.assign(new this.use(), data);
  }

  saveOne(data: Partial<M & Record<string, any>>) {
    const model = this.map(data);
    this.state.value[model.$primaryKey()] = model;
    return model;
  }

  save(data: MaybeAsArray<Partial<M & Record<string, any>>>) {
    if (Array.isArray(data)) {
      return data.map(this.saveOne.bind(this));
    }
    return this.saveOne(data);
  }

  all() {
    return new QueryBuilder(this).get();
  }

  with(...relations: string[]) {
    return new QueryBuilder(this).with(...relations);
  }
}
