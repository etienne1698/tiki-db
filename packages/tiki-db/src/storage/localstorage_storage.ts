import { CollectionSchema } from "../collection/collection_schema";
import { Database } from "../database/database";
import { Query } from "../query/query";
import { Relations, Relation } from "../relation/relation";
import { Primary, AnyButMaybeT, MaybeAsArray } from "../types";
import { Storage } from "./storage";

export class LocalStorageStorage implements Storage<true> {
  constructor(public database: Database) {}

  load<C extends CollectionSchema>(collection: C): boolean {
    return true
  }
  async get<C extends CollectionSchema, D extends Database = Database>(
    collection: C,
    query?: Query<C, D> | undefined
  ): Promise<ReturnType<C["model"]["normalize"]>[]> {
    return [];
  }

  async remove<C extends CollectionSchema, D extends Database = Database>(
    collection: C,
    primary: Primary,
    query?: Query<C, D> | undefined
  ): Promise<Partial<ReturnType<C["model"]["normalize"]>> | undefined> {
    return undefined;
  }

  async update<C extends CollectionSchema, D extends Database = Database>(
    collection: C,
    primary: Primary,
    data: AnyButMaybeT<ReturnType<C["model"]["normalize"]>>,
    query?: Query<C, D> | undefined
  ): Promise<Partial<ReturnType<C["model"]["normalize"]>> | undefined> {
    return undefined;
  }

  async insert<C extends CollectionSchema, D extends Database = Database>(
    collection: C,
    data: MaybeAsArray<AnyButMaybeT<ReturnType<C["model"]["normalize"]>>>
  ): Promise<(ReturnType<C["model"]["normalize"]> | undefined)[] | undefined> {
    return undefined;
  }

  async save<C extends CollectionSchema, D extends Database = Database>(
    collection: C,
    data: MaybeAsArray<AnyButMaybeT<ReturnType<C["model"]["normalize"]>>>,
    saveRelations?: boolean
  ): Promise<
    | Partial<ReturnType<C["model"]["normalize"]>>
    | Partial<ReturnType<C["model"]["normalize"]>>[]
  > {
    return {};
  }

  async saveOne<C extends CollectionSchema, D extends Database = Database>(
    collection: C,
    data: AnyButMaybeT<ReturnType<C["model"]["normalize"]>>,
    saveRelations?: boolean
  ): Promise<Partial<ReturnType<C["model"]["normalize"]>> | undefined> {
    throw new Error("Method not implemented.");
  }

  async saveRelations<R extends Relations, D extends Database = Database>(
    relations: R,
    data: Record<string, any>
  ): Promise<void> {}

  async getByPrimary<C extends CollectionSchema, D extends Database = Database>(
    collection: C,
    primary: Primary
  ): Promise<ReturnType<C["model"]["normalize"]> | undefined> {
    return undefined;
  }

  async getByPrimaries<C extends CollectionSchema, D extends Database = Database>(
    collection: C,
    primaries: Primary[]
  ): Promise<ReturnType<C["model"]["normalize"]>[]> {
    return [];
  }
}
