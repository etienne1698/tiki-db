import { Collection } from "../collection/collection";
import { Database } from "../database/database";
import { DefaultSyncStorage } from "./default_storage";

export class InMemoryStorage<
  D extends Database = Database
> extends DefaultSyncStorage<D> {
  stores: any = {};

  getStore<C extends Collection>(collection: C) {
    return this.stores[collection.model.dbName];
  }

  load<C extends Collection>(collection: C): boolean {
    this.stores[collection.model.dbName] = {};
    return true;
  }
}
