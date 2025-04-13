import { Collection } from "../collection/collection";
import { DefaultStorage } from "./default_storage";

export class InMemoryStorage extends DefaultStorage {
  stores: any = {};

  getStore<C extends Collection>(collection: C) {
    return this.stores[collection.model.dbName];
  }

  load<C extends Collection>(collection: C): boolean {
    this.stores[collection.model.dbName] = {};
    return true;
  }
}
