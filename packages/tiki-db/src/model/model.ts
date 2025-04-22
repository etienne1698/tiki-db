import type { Field } from "./field";
import type {
  AnyButMaybeT,
  InferModelNormalizedType,
  Primary,
  PrimaryKey,
} from "../types";

export class Model<
  S extends Record<string, Field> = Record<string, Field<unknown>>,
  DbName extends string = string
> {
  constructor(
    public dbName: DbName,
    public schema: S,
    public primaryKey: PrimaryKey
  ) {}

  primary(data: AnyButMaybeT<InferModelNormalizedType<typeof this>>): Primary {
    if (typeof this.primaryKey === "string") {
      return data[this.primaryKey];
    }
    return this.primaryKey.map((k) => data[k]).join();
  }

  normalize(data: any) {
    const normalizedData: { [K in keyof S]: S[K]["defaultValue"] } = {} as {
      [K in keyof S]: S[K]["defaultValue"];
    };
    for (const key in this.schema) {
      const field = this.schema[key];
      normalizedData[key] = field.normalize(data[key]);
    }
    return normalizedData;
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
    version: number;
  }>
) {
  return new Model(name, schema, opts?.primaryKey || "id");
}
