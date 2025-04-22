import { Database, DatabaseFullSchema } from "../database/database";
import { createDefaultQuery, Query } from "../query/query";
import {
  AnyButMaybeT,
  DeepPartial,
  InferModelNormalizedType,
  MaybeAsArray,
} from "../types";
import { CollectionSchema } from "./collection_schema";

export class Collection<
  IsAsync extends boolean,
  Schema extends CollectionSchema,
  DBFullSchema extends DatabaseFullSchema = DatabaseFullSchema
> {
  constructor(
    public database: Database<IsAsync, DBFullSchema>,
    public schema: Schema
  ) {}

  insert(
    data: MaybeAsArray<AnyButMaybeT<InferModelNormalizedType<Schema["model"]>>>
  ) {
    return this.database.storage.insert(this.schema, data);
  }

  update(
    primary: ReturnType<typeof this.schema.model.primary>,
    data: MaybeAsArray<AnyButMaybeT<InferModelNormalizedType<Schema["model"]>>>
  ) {
    return this.database.storage.update(this.schema, primary, data);
  }

  find<
    Q extends Query<Schema, typeof this.database.schema> = Query<
      Schema,
      typeof this.database.schema
    >
  >(query: Partial<Q>) {
    return this.database.storage.find(
      this.schema,
      Object.assign(createDefaultQuery<Schema, DBFullSchema>(), query)
    );
  }

  findFirst<
    Q extends Query<Schema, typeof this.database.schema> = Query<
      Schema,
      typeof this.database.schema
    >
  >(query: Partial<Q>) {
    return this.database.storage.findFirst(
      this.schema,
      Object.assign(createDefaultQuery<Schema, DBFullSchema>(), query)
    );
  }

  queryBuilder<
    Q extends Query<Schema, typeof this.database.schema> = Query<
      Schema,
      typeof this.database.schema
    >
  >(query: DeepPartial<Q>) {
    return this.database.queryBuilder(this.schema, query);
  }
}
