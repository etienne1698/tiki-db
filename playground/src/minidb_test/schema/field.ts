export abstract class Field<T = unknown, Default extends T | null = T | null> {
  isPrimary: boolean = false;
  isNullable: boolean = true;

  constructor(public name: string, public defaultValue: Default) {}

  abstract check(data: any): data is T;

  primary() {
    this.isPrimary = true;
    return this;
  }

  notNull() {
    this.isNullable = false;
    return this as Field<T, T>;
  }

  normalize(data: any): Default {
    if ((this.isNullable && data == null) || this.check(data)) return data;
    return this.defaultValue;
  }
}
