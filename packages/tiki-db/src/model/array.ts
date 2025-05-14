import type { InferNormalizedField } from "../types";
import { Field } from "./field";

export class ArrayField<F extends Field, DbName extends string = string> extends Field<
  Array<InferNormalizedField<F>>,
  DbName
> {
  protected declare contentField: F;

  constructor(dbName: DbName, defaultValue: Array<any> | null) {
    super(dbName, defaultValue);
  }

  check(data: any): data is Array<InferNormalizedField<F>> {
    if (!Array.isArray(data)) return false;
    data = data.map((field) => this.contentField.normalize(field));
    return data;
  }
}

export function array<DbName extends string = string>(dbName: DbName, defaultValue: Array<any>) {
  return new ArrayField(dbName, defaultValue);
}
