import type { Field } from "./field";
import type {
  AnyButMaybeT,
  InferModelFieldName,
  InferModelNormalizedInDatabaseType,
  InferModelNormalizedType,
  Primary,
  PrimaryKey,
} from "../types";
import { CollectionSchema } from "../collection/collection_schema";
import { QueryFilters } from "../query/query";

export class Model<
  Schema extends Record<string, Field> = Record<string, Field<unknown>>,
  DbName extends string = string
> {
  constructor(
    public dbName: DbName,
    public schema: Schema,
    public primaryKey: PrimaryKey
  ) {}

  primary(data: AnyButMaybeT<InferModelNormalizedType<typeof this>>): Primary {
    if (typeof this.primaryKey === "string") {
      return data[this.primaryKey];
    }
    return this.primaryKey.map((k) => data[k]).join();
  }

  normalize(data: AnyButMaybeT<InferModelNormalizedType<this>>) {
    const normalizedData: InferModelNormalizedType<this> =
      {} as InferModelNormalizedType<this>;
    for (const key in this.schema) {
      const field = this.schema[key];
      normalizedData[key] = field.normalize(data[key]);
    }
    return normalizedData;
  }

  mapToDB(data: InferModelNormalizedType<this>) {
    const result: InferModelNormalizedInDatabaseType<this> =
      {} as InferModelNormalizedInDatabaseType<this>;
    for (const [key, field] of Object.entries(this.schema)) {
      // @ts-ignore
      result[field.dbName] = data[key];
    }
    return result;
  }

  mapFromDB(data: InferModelNormalizedInDatabaseType<this>) {
    const result: InferModelNormalizedType<this> =
      {} as InferModelNormalizedType<this>;
    for (const [key, field] of Object.entries(this.schema)) {
      // @ts-ignore
      result[key] = data[field.dbName];
    }
    return result;
  }

  getFilterByPrimary<C extends CollectionSchema<this> = CollectionSchema<this>>(
    data: InferModelNormalizedType<this>
  ): QueryFilters<C> {
    if (typeof this.primaryKey === "string") {
      return {
        [this.primaryKey as InferModelFieldName<this>]: {
          $eq: data[this.primaryKey],
        },
      } as QueryFilters<C>;
    } else {
      const result = {} as QueryFilters<C>;
      for (const p of this.primaryKey) {
        // @ts-ignore
        result[p] = {
          $eq: data[p],
        };
      }
      return result;
    }
  }
}

export function model<
  S extends Record<string, Field>,
  DBName extends string = string
>(
  name: DBName,
  schema: S,
  opts?: Partial<{
    primaryKey: PrimaryKey;
  }>
) {
  return new Model(name, schema, opts?.primaryKey || "id");
}
