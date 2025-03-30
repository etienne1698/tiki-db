import { Database } from "vue-orm.js";
import { useState } from "#app";

export default class NuxtDatabase extends Database {
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
