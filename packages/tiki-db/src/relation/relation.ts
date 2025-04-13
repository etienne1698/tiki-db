import type { Database } from "../database/database";
import type { Model } from "../model/model";
import { QueryBuilder } from "../query/query_builder";
import { Storage } from "../storage/storage";
import type { InferModelNormalizedType } from "../types";

export abstract class Relation<
  M extends Model = Model,
  MRelated extends Model = Model
> {
  declare model: M;
  constructor(public related: MRelated, public field: unknown) {}

  abstract queryFor<D extends Database, S extends Storage>(
    data: any,
    database: D,
    storage: S
  ): QueryBuilder<D["mapCollectionDbNameCollection"][MRelated["dbName"]], D>;

  abstract getFor<D extends Database, S extends Storage>(
    data: any,
    database: D,
    storage: S
  ):
    | Promise<
        | InferModelNormalizedType<MRelated>
        | undefined
        | InferModelNormalizedType<MRelated>[]
      >
    | InferModelNormalizedType<MRelated>
    | undefined
    | InferModelNormalizedType<MRelated>[];
}

export class Relations<
  M extends Model = Model,
  R extends Record<string, Relation> = Record<string, Relation>
> {
  constructor(public model: M, public schema: R) {
    for (const key in this.schema) {
      this.schema[key].model = this.model;
    }
  }
}
