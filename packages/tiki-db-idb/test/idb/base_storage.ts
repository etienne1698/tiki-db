import "fake-indexeddb/auto";
import { IndexedDBStorage } from "../../src";

export function getTestStorage() {
  return new IndexedDBStorage();
}
