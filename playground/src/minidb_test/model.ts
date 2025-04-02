import type { Relation } from "./relation";

export type ModelSchema<
  T,
  Relations extends Record<string, Relation<unknown>> = {}
> = {
  relations: () => Relations;
  map(data: any): T;
  primaryKey: string | string[];
  entity: string;
};

export type InferMappedModel<T extends ModelSchema<unknown>> = ReturnType<
  T["map"]
>;

const defaultMap = <T>(data: any) => data as T;


export function model<T, Relations extends Record<string, Relation<unknown>> = {}>({
  primaryKey,
  entity,
  relations,
  map,
}: Partial<ModelSchema<T, Relations>> &
  Pick<ModelSchema<T, Relations>, "entity">) {
  return {
    relations: (relations || (() => ({} as Relations))) as () => Relations,
    map: map || defaultMap,
    primaryKey: primaryKey || "id",
    entity,
  };
}