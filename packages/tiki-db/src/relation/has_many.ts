import type { Database } from "../database/database";
import type { Model } from "../model/model";
import { Relation } from "./relation";
import { QueryBuilder } from "../query/query_builder";
import { AnyCollection, InferModelNormalizedType } from "../types";
import { Storage } from "../storage/storage";

export class HasManyRelation<
  M extends Model,
  MRelated extends Model
> extends Relation<M, MRelated> {
  queryFor<D extends Database, S extends Storage>(
    data: any,
    database: D,
    storage: S
  ) {
    return database.query(
      database.mapCollectionDbNameCollection[this.related.dbName],
      {
        filters: {
          [this.field as string]: { $eq: this.model.primary(data) },
        },
      }
    ) as QueryBuilder<
      D["mapCollectionDbNameCollection"][MRelated["dbName"]],
      D
    >;
  }

  getFor<D extends Database, S extends Storage>(
    data: any,
    database: D,
    storage: S
  ) {
    return storage.get(
      database.mapCollectionDbNameCollection[this.related.dbName],
      this.queryFor(data, database, storage).query
    ) as InferModelNormalizedType<MRelated>[] | Promise<InferModelNormalizedType<MRelated>[]>;
  }
}
