import type { Field } from "./field";

class Schema<S extends Record<string, Field>> {
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

export function schema<S extends Record<string, Field>>(s: S) {
  return new Schema(s);
}
