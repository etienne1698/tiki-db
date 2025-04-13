import type { Database } from "../database/database";
import type { Model } from "../model/model";
import { QueryBuilder } from "../query/query_builder";
import { Storage } from "../storage/storage";

export abstract class Relation<
  M extends Model = Model,
  MRelated extends Model = Model
> {
  abstract multiple: boolean;

  declare model: M;
  constructor(public related: MRelated, public field: unknown) {}

  abstract queryFor<D extends Database, S extends Storage>(
    data: any,
    database: D
  ): QueryBuilder<D["mapCollectionDbNameCollection"][MRelated["dbName"]], D>;
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
