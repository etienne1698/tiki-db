import type { Field } from "./field";
import type {
  AnyButMaybeT,
  InferModelFieldName,
  InferModelNormalizedInDatabaseType,
  InferModelNormalizedType,
  PrimaryKey,
} from "../types";
import { CollectionSchema } from "../collection/collection_schema";
import { QueryFilters } from "../query/query";

type ModelIndex<
  Schema extends Record<string, Field> = Record<string, Field<unknown>>
> = {
  name: string;
  keyPath: keyof Schema | (keyof Schema)[];
  unique?: boolean;
};

export class Model<
  Schema extends Record<string, Field> = Record<string, Field<unknown>>,
  DbName extends string = string
> {
  constructor(
    public dbName: DbName,
    public schema: Schema,
    public primaryKey: PrimaryKey,
    public indexes: ModelIndex[]
  ) {}

  primary(
    data: AnyButMaybeT<InferModelNormalizedType<typeof this>>
  ): string | string[] {
    if (typeof this.primaryKey === "string") {
      return data[this.primaryKey];
    }
    return this.primaryKey.map((k) => data[k]);
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
    for (const [key, value] of Object.entries(data)) {
      if (!this.schema[key]) continue;
      const dbName = this.schema[key].dbName;
      // @ts-ignore
      result[dbName] = value;
    }
    return result;
  }

  /**
   * If mapFromDB finds a field that is not part of the schema,
   * it inserts it into the result without modifying the key.
   * This is useful for mapping relations that are set externally (see inMemoryStorage.findMany).
   */
  mapFromDB(data: AnyButMaybeT<InferModelNormalizedInDatabaseType<this>>) {
    const result: InferModelNormalizedType<this> =
      {} as InferModelNormalizedType<this>;
    for (const [key, value] of Object.entries(data)) {
      // TODO: this is heavy, save tsNames on "extractFullSchema" and use it
      const matchedEntry = Object.entries(this.schema).find(
        ([_, v]) => v.dbName == key
      );
      if (!matchedEntry) {
        // @ts-ignore
        result[key] = value;
      } else {
        const tsName = matchedEntry[0];
        // @ts-ignore
        result[tsName] = value;
      }
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
    primaryKey: InferModelFieldName<Model<S>>;
    indexes?: ModelIndex<S>[];
  }>
) {
  return new Model(
    name,
    schema,
    (opts?.primaryKey as string) || "id",
    opts?.indexes as ModelIndex[]
  );
}
