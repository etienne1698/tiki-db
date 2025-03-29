import type Relation from "./Relation";
import type { PrimaryKey } from "./types";

export default abstract class Model {
  static primaryKey: string | string[] = "id";
  static entity: string = "";

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

  static relations: () => Record<string, Relation> = () => ({});

  $toJSON() {
    return this;
  }

  $clone() {
    return Object.assign(Object.create(this), this);
  }

  $merge(m: Model) {
    return Object.assign(this, m);
  }
}

// export type RelationsOf<M extends Model> = keyof ReturnType<M["relations"]>;

// TODO : delete this and do correct types...
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type RelationsOf<M extends Model> = string;
