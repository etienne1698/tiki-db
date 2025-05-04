import { CollectionSchema } from "../collection/collection_schema";
import { Database } from "../database/database";

export type Plugin = Partial<{
  beforeInit(db: Database): Promise<void>;
  afterInit(db: Database): Promise<void>;
  extendsSchema<
    Schema extends Record<string, CollectionSchema> = Record<
      string,
      CollectionSchema
    >
  >(
    schema: Schema
  ): Record<string, CollectionSchema>;
}>;
