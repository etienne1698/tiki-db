import {
  Collection,
  CollectionSchema,
  Database,
  DatabaseFullSchema,
  Migrations,
  Storage,
} from "tiki-db";
import { ref } from "vue";

export class VueCollectionWrapper<
  IsAsync extends boolean,
  Schema extends CollectionSchema,
  DBFullSchema extends DatabaseFullSchema = DatabaseFullSchema
> {
  constructor(public collection: Collection<IsAsync, Schema, DBFullSchema>) {}

  find(query: Parameters<typeof this.collection.find>[0]) {
    return ref(this.collection.find(query));
  }
}

export class VueDatabaseWrapper<
  IsAsync extends boolean = false,
  FullSchema extends DatabaseFullSchema = DatabaseFullSchema,
  S extends Storage<FullSchema, IsAsync> = Storage<FullSchema, IsAsync>,
  M extends Migrations<FullSchema> = Migrations<FullSchema>
> {
  declare collections: {
    [K in keyof FullSchema["schema"]]: VueCollectionWrapper<
      IsAsync,
      FullSchema["schema"][K],
      FullSchema
    >;
  };

  constructor(public database: Database<IsAsync, FullSchema, S, M>) {
    for (const [key, collection] of Object.entries(database.collections)) {
      // @ts-ignore
      this.collections[key] = new VueCollectionWrapper(collection);
    }
  }
}
