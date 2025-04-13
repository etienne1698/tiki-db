import type { Database } from "../database/database";
import type { Model } from "../model/model";
import { QueryBuilder } from "../query/query_builder";
import type { InferModelFieldName, InferModelNormalizedType } from "../types";
import { Relation } from "./relation";

export class BelongsToRelation<
  M extends Model = Model,
  MRelated extends Model = Model
> extends Relation<M, MRelated> {
  multiple: false = false;

  queryFor<D extends Database>(data: any, database: D) {
    return database
      .query(database.mapCollectionDbNameCollection[this.related.dbName])
      .byPrimary([data[this.field as string]]) as QueryBuilder<
      D["mapCollectionDbNameCollection"][MRelated["dbName"]],
      D
    >;
  }
}

export function belongsTo<M extends Model, MRelated extends Model = Model>(
  model: MRelated,
  field: InferModelFieldName<M>
) {
  return new BelongsToRelation(model, field);
}
