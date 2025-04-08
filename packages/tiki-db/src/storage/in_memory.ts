import { Collection } from "../collection/collection";
import { DefaultSyncStorage } from "./default_sync_storage";

export class InMemoryStorage extends DefaultSyncStorage {
  stores: any = {};

  getStore<C extends Collection>(collection: C) {
    return this.stores[collection.model.dbName];
  }

  load<C extends Collection>(collection: C): boolean {
    this.stores[collection.model.dbName] = {};
    return true;
  }
}
