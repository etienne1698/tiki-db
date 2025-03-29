import type Model from "./Model";

export interface Constructor<T> {
  new (): T;
}

export type ModelConstructor<M extends Model> = Constructor<M> & {
  entity: typeof Model.entity;
  relations: typeof Model.relations;
  primaryKey: typeof Model.primaryKey;
};

export type PrimaryKey = string;

export type MaybeAsArray<T> = T | Array<T>;
