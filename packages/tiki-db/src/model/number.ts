import { Field } from "./field";

export class NumberField extends Field<number> {
  constructor(name: string, defaultValue: number | null) {
    super(name, defaultValue);
  }

  check(data: any): data is number {
    return typeof data === "number";
  }
}

export function number(name: string, defaultValue: number) {
  return new NumberField(name, defaultValue);
}
