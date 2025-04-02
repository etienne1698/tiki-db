import type { Field } from "./field";

export class Schema<
  S extends Record<string, Field> = Record<string, Field<unknown>>
> {
  declare schema: S;

  constructor(schema: S) {
    this.schema = schema;
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
