import { Field } from "./field";

export class NumberField extends Field<number> {
  constructor(dbName: string, defaultValue: number | null) {
    super(dbName, defaultValue);
  }

  check(data: any): data is number {
    return typeof data === "number";
  }
}

export function number(dbName: string, defaultValue?: number | null) {
  return new NumberField(dbName, defaultValue || null);
}
