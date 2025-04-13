import { CollectionSchema } from "../collection/collection_schema";
import { DefaultStorage } from "./default_storage";

export class InMemoryStorage extends DefaultStorage {
  stores: any = {};

  getStore<C extends CollectionSchema>(collection: C) {
    return this.stores[collection.model.dbName];
  }

  load<C extends CollectionSchema>(collection: C): boolean {
    this.stores[collection.model.dbName] = {};
    return true;
  }
}
