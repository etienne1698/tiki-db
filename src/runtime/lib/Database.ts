import type { Ref } from "vue";
import { useState } from "#app";

export interface Database {
  getStore(entity: string): Ref;
}

export class NuxtDatabase implements Database {
  declare prefix: string;

  static createWithPrefix(prefix: string) {
    const db = new NuxtDatabase();
    db.prefix = prefix;
    return db;
  }

  getStore(entity: string) {
    return useState(this.prefix + entity, () => ({}));
  }
}
