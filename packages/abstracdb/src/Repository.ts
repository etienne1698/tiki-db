import { Model } from "./Model";
import type { MapModelOptions, MaybeAsArray, ModelConstructor } from "./types";
import type { Database } from "./Database";

export type RepositoryOptions<M extends Model = Model> = {
  use: ModelConstructor<M>;
  database?: Database;
};

export class Repository<M extends Model = Model> {
  declare use: ModelConstructor<M>;
  declare database: Database;

  withOptions<M extends Model>(options: Partial<RepositoryOptions<M>>) {
    Object.assign(this, options);
    this.init();
    return this;
  }

  static createWithOptions<M extends Model = Model>(
    options: RepositoryOptions<M>
  ) {
    return new Repository<M>().withOptions(options);
  }

  init() {
    this.database.load(this.use);
  }

  map(data: MapModelOptions<M>) {
    return this.database.map(this.use, data);
  }

  saveRelations(data: Record<string, any>) {
    return this.database.saveRelations(this.use, data);
  }

  saveOne(data: MapModelOptions<M>, saveRelations: boolean = true) {
    return this.database.saveOne(this.use, data, saveRelations);
  }

  save(data: MaybeAsArray<MapModelOptions<M>>, saveRelations: boolean = true) {
    return this.database.save(this.use, data, saveRelations);
  }

  delete(primary: string) {
    return this.database.delete(this.use, primary);
  }

  query() {
    return this.database.query(this.use);
  }
}
