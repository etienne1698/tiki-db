export abstract class Field<T = unknown, Default extends T | null = T | null> {
  declare name: string;
  declare default: Default;
  isPrimary: boolean = false;
  isNullable: boolean = true;

  constructor(name: string, defaultValue: Default) {
    this.default = defaultValue;
    this.name = name;
  }

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
    return this.default;
  }
}
