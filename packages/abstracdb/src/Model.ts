import type { Relation } from "./Relation";
import type { MapModelOptions, ModelConstructor, Primary, PrimaryKey } from "./types";

export abstract class Model {
  static primaryKey: PrimaryKey = "id";
  static entity: string = "";
  static relations: () => Record<string, Relation> = () => ({});

  $primary(): Primary {
    // @ts-ignore
    return Model.primary(this.primaryKey || Model.primaryKey, this);
  }

  static primary<M extends Model>(
    primaryKey: PrimaryKey,
    data: MapModelOptions<M>
  ): Primary {
    if (typeof primaryKey === "string") {
      return data[primaryKey] as string;
    }
    return primaryKey.map((k) => data[k]).join();
  }

  $clone() {
    return Object.assign(Object.create(this), this);
  }

  $merge<M extends Model>(m: MapModelOptions<M>) {
    return Object.assign(this, m);
  }
}