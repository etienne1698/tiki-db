import "fake-indexeddb/auto";
import { BetterSqlite3Storage } from "../../src";

export function getTestStorage() {
  return new BetterSqlite3Storage();
}
