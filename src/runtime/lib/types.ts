import type Model from "./Model";
import type { Relation } from "./Relation";

export interface Constructor<T> {
  new (): T;
}

export type ModelConstructor<M extends Model> = Constructor<M> & {
  entity: string;
  relations: { [key: string]: Relation };
};

export type PrimaryKey = string;
