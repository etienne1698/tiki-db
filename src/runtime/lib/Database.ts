import { useState } from "#app";

export default class Database {
  prefix = "";

  createWithPrefix(prefix: string) {
    const db = new Database();
    db.prefix = prefix;
    return db;
  }

  getStore(entity: string) {
    return useState(this.prefix + entity, () => ({}));
  }
}
