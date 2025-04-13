import type { Database } from "../database/database";
import type { Model } from "../model/model";
import type { Collection } from "../collection/collection";
import type {
  AnyCollection,
  InferModelFieldName,
  InferModelNormalizedType,
} from "../types";
import { Relation } from "./relation";

export class HasManyRelation<
  M extends Model,
  MRelated extends Model
> extends Relation<M, MRelated> {
  getFor(
    model: M,
    data: any,
    database: Database
  ): InferModelNormalizedType<MRelated>[] {
    return (
      database.collections[model.dbName] as Collection<AnyCollection, Database>
    ).find({
      filters: {
        [this.field as string]: { $eq: model.primary(data) },
      },
    }) as unknown as InferModelNormalizedType<MRelated>[];
  }
}
