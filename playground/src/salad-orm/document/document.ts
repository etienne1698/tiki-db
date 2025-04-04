import type { Field } from "./field";
import { Schema } from "./schema";
import type {
  AnyButMaybeT,
  InferModelNormalizedType,
  Primary,
  PrimaryKey,
} from "../types";

export class Model<S extends Schema = Schema> {
  constructor(
    public type: string,
    public primaryKey: PrimaryKey,
    public schema: S
  ) {}

  primary(data: AnyButMaybeT<InferModelNormalizedType<typeof this>>): Primary {
    if (typeof this.primaryKey === "string") {
      return data[this.primaryKey];
    }
    return this.primaryKey.map((k) => data[k]).join();
  }
}

export function model<S extends Record<string, Field>>(
  name: string,
  schema: S,
  opts?: Partial<{
    primaryKey: PrimaryKey;
  }>
) {
  return new Model(name, opts?.primaryKey || "id", new Schema(schema));
}
