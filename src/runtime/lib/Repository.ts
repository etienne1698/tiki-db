import type { Ref } from "vue";
import Model from "./Model";
import type {
  MapModelOptions,
  MaybeAsArray,
  ModelConstructor,
  PrimaryKey,
} from "./types";
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

  map(data: MapModelOptions<M>) {
    /* console.error(this.use.map);
    if (this.use.map) return this.use.map(data); */
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

  saveOne(data: MapModelOptions<M>, saveRelations: boolean = true) {
    const model = this.map(data);
    if (saveRelations) this.saveRelations(model);
    const primary = model.$primaryKey();
    const state = this.state.value[primary];
    if (state) {
      this.state.value[primary] = state.$merge(model);
    } else {
      this.state.value[primary] = model;
    }
    return model;
  }

  save(data: MaybeAsArray<MapModelOptions<M>>, saveRelations: boolean = true) {
    if (Array.isArray(data)) {
      return data.map((d) => this.saveOne.bind(this)(d, saveRelations));
    }
    return this.saveOne(data, saveRelations);
  }

  query() {
    return new QueryBuilder(this);
  }
}
