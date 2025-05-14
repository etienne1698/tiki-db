import type { Field } from "./field";
import type {
  AnyButMaybeT,
  InferModelNormalizedInDatabaseType,
  InferModelNormalizedType,
  Primary,
  PrimaryKey,
} from "../types";

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
