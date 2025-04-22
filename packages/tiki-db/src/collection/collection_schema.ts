import type { Model } from "../model/model";
import { Relations } from "../relation/relation";

export class CollectionSchema<
  M extends Model = Model,
  R extends Relations = Relations
> {
  constructor(public model: M, public relations: R) {}
}

export function collection<
  M extends Model = Model,
  R extends Relations = Relations
>(model: M, relations?: R) {
  return new CollectionSchema<M, R>(model, relations || (new Relations(model, {}) as unknown as R));
}
