import { CollectionSchema } from "../../collection/collection_schema";
import { DatabaseFullSchema } from "../../database/database";
import { Query, QueryResult } from "../../query/query";
import { Relations } from "../../relation/relation";
import { Primary, AnyButMaybeT, MaybeAsArray } from "../../types";
import { Storage } from "../storage";

export class InMemoryStorage<
  FullSchema extends DatabaseFullSchema = DatabaseFullSchema
> implements Storage<FullSchema>
{
  stores: { [key in keyof FullSchema["schema"]]: any } = {} as {
    [key in keyof FullSchema["schemaDbName"]]: Array<
      ReturnType<FullSchema["schemaDbName"][key]["model"]["normalize"]>
    >;
  };

  load<C extends CollectionSchema>(collection: C): boolean {
    // @ts-ignore
    this.stores[collection.model.dbName] = [];
    return true;
  }

  find<
    C extends CollectionSchema,
    Q extends Query<C, FullSchema> = Query<C, FullSchema>
  >(collection: C, query?: Q | undefined): QueryResult<C, FullSchema, Q> {
    return this.stores[collection.model.dbName];
  }

  findFirst<
    C extends CollectionSchema,
    Q extends Query<C, FullSchema> = Query<C, FullSchema>
  >(
    collection: C,
    query?: Q | undefined
  ): ReturnType<C["model"]["normalize"]> & {
    [K in keyof Q["with"]]: K extends keyof C["relations"]["schema"]
      ? Q["with"][K] extends true
        ? C["relations"]["schema"][K]["multiple"] extends true
          ? ReturnType<C["relations"]["schema"][K]["related"]["normalize"]>[]
          :
              | ReturnType<C["relations"]["schema"][K]["related"]["normalize"]>
              | undefined
        : never
      : never;
  } {
    return this.find(collection, query)?.[0];
  }
  remove<C extends CollectionSchema>(
    collection: C,
    primary: Primary,
    query?: Query<C, FullSchema> | undefined
  ): Partial<ReturnType<C["model"]["normalize"]>> | undefined {
    throw new Error("Method not implemented.");
  }
  update<C extends CollectionSchema>(
    collection: C,
    primary: Primary,
    data: AnyButMaybeT<ReturnType<C["model"]["normalize"]>>,
    query?: Query<C, FullSchema> | undefined
  ): Partial<ReturnType<C["model"]["normalize"]>> | undefined {
    throw new Error("Method not implemented.");
  }
  insert<C extends CollectionSchema>(
    collection: C,
    data: MaybeAsArray<AnyButMaybeT<ReturnType<C["model"]["normalize"]>>>
  ): Partial<ReturnType<C["model"]["normalize"]>> | undefined {
    const inserted = collection.model.normalize(data);
    this.stores[collection.model.dbName].push(inserted);
    return inserted as ReturnType<C["model"]["normalize"]>;
  }
  insertRelations<C extends CollectionSchema>(
    collection: C,
    relation: keyof C["relations"],
    data: Record<string, any>
  ): void {
    throw new Error("Method not implemented.");
  }
  getByPrimary<C extends CollectionSchema>(
    collection: C,
    primary: Primary
  ): ReturnType<C["model"]["normalize"]> | undefined {
    throw new Error("Method not implemented.");
  }
  getByPrimaries<C extends CollectionSchema>(
    collection: C,
    primaries: Primary[]
  ): ReturnType<C["model"]["normalize"]>[] {
    throw new Error("Method not implemented.");
  }
}
