import { Database, DatabaseFullSchema } from "../database/database";
import { createDefaultQuery, Query } from "../query/query";
import { Relation } from "../relation/relation";
import { AnyButMaybeT, InferModelNormalizedType, MaybeAsArray } from "../types";
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

  private get schemaRelations() {
    return this.database.schema.schemaDbName[this.schema.model.dbName].relations
      .schema;
  }

  private createMissingRelatedFields(data: any) {
    for (const [relationKey, relation] of Object.entries(
      this.schemaRelations
    ) as [string, Relation][]) {
      if (data[relationKey]) {
        if (relation.multiple) {
          for (const relatedIndex in data[relationKey]) {
            for (const fieldIndex in relation.references) {
              data[relationKey][relatedIndex][relation.references[fieldIndex]] =
                data[relation.fields[fieldIndex]];
            }
          }
        } else {
          for (const fieldIndex in relation.references) {
            data[relationKey][relation.references[fieldIndex]] =
              data[relation.fields[fieldIndex]];
          }
        }
      }
    }
  }

  insert(
    data: MaybeAsArray<AnyButMaybeT<InferModelNormalizedType<Schema["model"]>>>,
    opts?: Partial<{
      saveRelations: boolean;
      createMissingRelatedFields: boolean;
    }>
  ) {
    if (opts?.createMissingRelatedFields) {
      this.createMissingRelatedFields(data);
    }
    return this.database.storage.insert(
      this.schema,
      data,
      opts?.saveRelations || true
    );
  }

  update<
    Q extends Query<Schema, typeof this.database.schema> = Query<
      Schema,
      typeof this.database.schema
    >
  >(
    query: Q,
    data: MaybeAsArray<AnyButMaybeT<InferModelNormalizedType<Schema["model"]>>>
  ) {
    return this.database.storage.update(this.schema, query, data);
  }

  remove<
    Q extends Query<Schema, typeof this.database.schema> = Query<
      Schema,
      typeof this.database.schema
    >
  >(query: Q) {
    return this.database.storage.remove(this.schema, query);
  }

  find<
    Q extends Query<Schema, typeof this.database.schema> = Query<
      Schema,
      typeof this.database.schema
    >
  >(query: Q) {
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
  >(query: Q) {
    return this.database.storage.findFirst<Schema, Q>(this.schema, query);
  }

  query<
    Q extends Query<Schema, typeof this.database.schema> = Query<
      Schema,
      typeof this.database.schema
    >
  >(query?: Q) {
    return this.database.query(this.schema, query);
  }
}
