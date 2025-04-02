import type { Database } from "../database";
import type { InferMappedModel, ModelSchema } from "../model";

export abstract class Relation<T, M extends ModelSchema<T> = ModelSchema<T>> {
  constructor(public related: M, public field: string) {
    this.related = related;
    this.field = field;
  }

  abstract getFor(
    data: any,
    database: Database<any>
  ): InferMappedModel<M> | InferMappedModel<M>[];
}



export type RelationSchema<R extends Record<string, Relation<unknown>>> = {
  entity: string;
  relations: R;
};

export function relations<R extends Record<string, Relation<unknown>>>(
  entity: string,
  relations: R
): RelationSchema<R> {
  return {
    entity,
    relations,
  };
}
