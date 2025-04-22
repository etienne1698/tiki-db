import {
  Collection,
  CollectionSchema,
  Database,
  DatabaseFullSchema,
  Migrations,
  Storage,
} from "tiki-db";
import { Ref, ref } from "vue";

export type IVueCollectionWrapper<
  IsAsync extends boolean,
  Schema extends CollectionSchema,
  DBFullSchema extends DatabaseFullSchema = DatabaseFullSchema,
  C extends Collection<IsAsync, Schema, DBFullSchema> = Collection<
    IsAsync,
    Schema,
    DBFullSchema
  >
> = {
  [K in keyof Omit<C, "database" | "schema" | "query">]: C[K] extends (
    ...args: any
  ) => any
    ? (...args: Parameters<C[K]>) => Ref<ReturnType<C[K]>>
    : never;
};

export class VueCollectionWrapper<
  Schema extends CollectionSchema,
  DBFullSchema extends DatabaseFullSchema = DatabaseFullSchema
> implements IVueCollectionWrapper<false, Schema, DBFullSchema>
{
  constructor(public collection: Collection<false, Schema, DBFullSchema>) {}

  findFirst(query: Parameters<typeof this.collection.findFirst>[0]) {
    const queryResult = this.collection.findFirst(query);
    return ref(queryResult) as Ref<
      ReturnType<typeof this.collection.findFirst>
    >;
  }

  find(query: Parameters<typeof this.collection.find>[0]) {
    const queryResult = this.collection.find(query);
    return ref(queryResult) as Ref<ReturnType<typeof this.collection.find>>;
  }

  update(
    primary: Parameters<typeof this.collection.update>[0],
    data: Parameters<typeof this.collection.update>[1]
  ) {
    const queryResult = this.collection.update(primary, data);
    return ref(queryResult) as Ref<ReturnType<typeof this.collection.update>>;
  }

  insert(data: Parameters<typeof this.collection.insert>[0]) {
    const queryResult = this.collection.insert(data);
    return ref(queryResult) as Ref<ReturnType<typeof this.collection.insert>>;
  }

  query(query: Parameters<typeof this.collection.query>[0]) {
    return this.collection.query(query);
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
