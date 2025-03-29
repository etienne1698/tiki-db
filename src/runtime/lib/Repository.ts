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
    return Object.assign(
      new this.use(),
      this.use.map ? this.use.map(data) : data
    );
  }

  saveRelations(data: Record<string, any>) {
    const modelRelations = this.use.relations();
    for (const [key, value] of Object.entries(data)) {
      if (modelRelations[key]) {
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete data[key];
        const repo = useRepo(modelRelations[key].related, this.database);
        repo.save(value);
      }
    }
  }

  saveOne(data: MapModelOptions<M>, saveRelations: boolean = true) {
    if (saveRelations) this.saveRelations(data);
    const model = this.map(data);
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

  delete(primary: string) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete this.state.value[primary];
  }

  /*  update(
    primary: string,
    data: MapModelOptions<M>,
    saveRelations: boolean = true
  ) {
    return this.saveOne(data, saveRelations);
  }
 */

  query() {
    return new QueryBuilder(this);
  }
}
