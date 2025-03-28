import type { Ref } from "vue";
import Model from "./Model";
import type { MaybeAsArray, ModelConstructor, PrimaryKey } from "./types";
import QueryBuilder from "./QueryBuilder";
import Database from "./Database";
import useRepo from "./useRepo";

export type RepositoryOptions<M extends Model = Model> = {
  use: ModelConstructor<M>;
  database?: Database;
};

export default class Repository<M extends Model = Model> {
  declare use: ModelConstructor<M>;
  declare state: Ref<Record<PrimaryKey, M>>;
  declare database: Database;

  constructor(opts?: RepositoryOptions<M>) {
    this.database = opts?.database || new Database();
    if (opts?.use) {
      this.use = opts.use;
    }
    this.init();
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

  saveRelations(model: M) {
    const modelRelations = this.use.relations();
    for (const [key, value] of Object.entries(model)) {
      if (modelRelations[key]) {
        const repo = useRepo(modelRelations[key].related, this.database);
        repo.save(value);
      }
    }
  }

  saveOne(data: Partial<M & Record<string, any>>) {
    const model = this.map(data);
    this.saveRelations(model);
    const state = this.state.value[model.$primaryKey()];
    if (state) {
      this.state.value[model.$primaryKey()] = state.$merge(model);
    } else {
      this.state.value[model.$primaryKey()] = model;
    }
    return model;
  }

  save(data: MaybeAsArray<Partial<M & Record<string, any>>>) {
    if (Array.isArray(data)) {
      return data.map(this.saveOne.bind(this));
    }
    return this.saveOne(data);
  }

  query() {
    return new QueryBuilder(this);
  }
}
