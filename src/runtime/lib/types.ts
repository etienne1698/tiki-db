import type Model from "./Model";

export interface Constructor<T> {
  new (): T;
}

export type ModelConstructor<M extends Model> = Constructor<M> & {
  entity: string;
};

export type PrimaryKey = string;
