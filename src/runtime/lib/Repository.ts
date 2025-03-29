import type { Ref } from "vue";
import Model from "./Model";
import type {
  MapModelOptions,
  MaybeAsArray,
  ModelConstructor,
  Primary,
} from "./types";
import QueryBuilder from "./QueryBuilder";
import Database from "./Database";

export type RepositoryOptions<M extends Model = Model> = {
  use: ModelConstructor<M>;
  database?: Database;
};

export default class Repository<M extends Model = Model> {
  declare use: ModelConstructor<M>;
  declare state: Ref<Record<Primary, M>>;
  declare database: Database;

  constructor(opts?: RepositoryOptions<M>) {
    this.database = opts?.database || new Database();
    if (opts?.use) {
      this.use = opts.use;
    }
    this.init();
  }

  static withOptions<M extends Model = Model>(
    repository: Repository<M>,
    options: RepositoryOptions<M>
  ) {
    const r = Object.assign(repository, options);
    r.init();
    return r;
  }

  static createWithOptions<M extends Model = Model>(
    options: RepositoryOptions<M>
  ) {
    return Repository.withOptions(new Repository<M>(), options);
  }

  init() {
    this.state = this.database.getStore(this.use.entity);

    if (
      Object.values(this.state.value) &&
      !(Object.values(this.state.value)[0] instanceof Model)
    ) {
      for (const key of Object.keys(this.state.value)) {
        this.state.value[key] = Object.assign(
          new this.use(),
          this.state.value[key]
        );
      }
    }
  }

  map(data: MapModelOptions<M>, oldValue?: M) {
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
        const repo = new Repository({
          use: modelRelations[key].related,
          database: this.database,
        });
        repo.save(value);
      }
    }
  }

  saveOne(data: MapModelOptions<M>, saveRelations: boolean = true) {
    if (saveRelations) this.saveRelations(data);

    const primary = Model.primary(this.use.primaryKey, data);
    const state = this.state.value[primary];
    if (state) {
      this.state.value[primary] = state.$merge(data);
      return this.state.value[primary];
    }
    const model = this.map(data);
    this.state.value[primary] = model;
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
