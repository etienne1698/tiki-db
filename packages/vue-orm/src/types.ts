import type { Model } from "./Model";

export interface Constructor<T> {
  new (): T;
}

export type ModelConstructor<M extends Model> = Constructor<M> & {
  entity: typeof Model.entity;
  relations: typeof Model.relations;
  primaryKey: typeof Model.primaryKey;
  map?: typeof Model.map;
};

export type PrimaryKey = string | string[];
export type Primary = string;

export type MaybeAsArray<T> = T | Array<T>;

// export type RelationsOf<M extends Model> = keyof ReturnType<M["relations"]>;

// TODO : delete this and do correct types...
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type RelationsOf<M extends Model> = string;

export type MapModelOptions<M extends Model> = Partial<M & Record<string, any>>;
