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
  multiple: true = true;

  queryFor<D extends Database>(data: any, database: D) {
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
}
