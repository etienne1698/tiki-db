import type { Database } from "tiki-db";

export class NuxtDatabases {
  databases: { [key: string]: Database } = {};

  set(name: string, db: unknown) {
    this.databases[name] = db as Database;
  }

  get(name: string) {
    return this.databases[name];
  }
}
