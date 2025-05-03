import { useState } from "nuxt/app";
import { CollectionSchema, DatabaseFullSchema } from "tiki-db";
import { AbstractVueCollectionWrapper } from "tiki-db-vue";

export class NuxtCollectionWrapper<
  Schema extends CollectionSchema,
  DBFullSchema extends DatabaseFullSchema = DatabaseFullSchema
> extends AbstractVueCollectionWrapper<Schema, DBFullSchema> {
  createRef(queryHash: string, queryResult: unknown) {
    return useState(queryHash, () => queryResult);
  }
}
