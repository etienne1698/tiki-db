import type { Model } from "../model/model";
import type { Relations } from "../relation/relation";

export class Collection<
  M extends Model = Model,
  R extends Relations = Relations
> {
  constructor(public model: M, public relations: R) {}
}

export function collection<
  M extends Model = Model,
  R extends Relations = Relations
>(model: M, relations: R) {
  return new Collection<M, R>(model, relations);
}
