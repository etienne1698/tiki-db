import "fake-indexeddb/auto";
import { IndexedDBStorage } from "../../src";

export async function getTestStorage() {
  return new IndexedDBStorage({ dbName: "myDB" });
}
