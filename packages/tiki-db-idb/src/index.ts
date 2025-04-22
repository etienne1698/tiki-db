import { IDBPDatabase, openDB } from "idb";
import {
  AnyButMaybeT,
  CollectionSchema,
  MaybeAsArray,
  Primary,
  Query,
  QueryResult,
  Storage,
} from "tiki-db";

export class IndexedDBStorage implements Storage {
  private db?: IDBPDatabase;
  private dbName = "TikiDB";
  private version = 1;
}
