import { Field } from "./field";

export class ArrayField extends Field<Array<any>> {
  constructor(name: string, defaultValue: Array<any> | null) {
    super(name, defaultValue);
  }

  check(data: any): data is Array<any> {
    return Array.isArray(data);
  }
}

export function array(name: string, defaultValue: Array<any>) {
  return new ArrayField(name, defaultValue);
}
