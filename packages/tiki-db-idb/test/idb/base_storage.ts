import { IndexedDBStorage } from "../../src/index";

import "fake-indexeddb/auto";

export function getTestStorage() {
  return new IndexedDBStorage();
}
