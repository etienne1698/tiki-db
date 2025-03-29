import type Relation from "./Relation";
import type { MapModelOptions, PrimaryKey } from "./types";

export default abstract class Model {
  static primaryKey: string | string[] = "id";
  static entity: string = "";
  static relations: () => Record<string, Relation> = () => ({});

  static map?: <M extends Model>(data: MapModelOptions<M>) => unknown;

  $primaryKey(): PrimaryKey {
    // @ts-ignore
    const primaryKey: string | string[] = this.primaryKey || Model.primaryKey;
    if (typeof primaryKey === "string") {
      // @ts-ignore
      return this[primaryKey];
    }
    // @ts-ignore
    return primaryKey.map((k) => this[k]).join();
  }

  $toJSON() {
    return this;
  }

  $clone() {
    return Object.assign(Object.create(this), this);
  }

  static clone<M extends Model>(model: M | M[]) {
    return Array.isArray(model) ? model.map((m) => m.$clone()) : model.$clone();
  }

  $merge(m: Model) {
    return Object.assign(this, m);
  }
}
