import type { InferNormalizedField } from "../types";
import { Field } from "./field";

export class ArrayField<F extends Field> extends Field<
  Array<InferNormalizedField<F>>
> {
  protected declare contentField: F;

  constructor(name: string, defaultValue: Array<any> | null) {
    super(name, defaultValue);
  }

  check(data: any): data is Array<InferNormalizedField<F>> {
    if (!Array.isArray(data)) return false;
    data = data.map((field) => this.contentField.normalize(field));
    return data;
  }
}

export function array(name: string, defaultValue: Array<any>) {
  return new ArrayField(name, defaultValue);
}
