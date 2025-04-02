import type { Field } from "./field";

export class Schema<
  S extends Record<string, Field> = Record<string, Field<unknown>>
> {
  declare schema: S;

  constructor(schema: S) {
    this.schema = schema;
  }

  normalize(data: any) {
    const normalizedData: Partial<Record<keyof S, any>> = {};
    for (const key in this.schema) {
      const field = this.schema[key];
      normalizedData[key] = field.normalize(data[key]);
    }
    return normalizedData;
  }
}

export type InferNormalizedSchema<S extends Schema> = ReturnType<S["normalize"]>;
