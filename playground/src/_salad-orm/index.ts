/**
 * README 👋
 *
 * `SynDB` is a lightweight abstraction layer for data access in Javascript/Typescript applications, with great Typescript support.
 * It provides a structured way to interact with data models and relationships while remaining store-agnostic.
 *
 *
 * Inspirations:
 * - https://github.com/pubkey/rxdb
 * - https://github.com/drizzle-team/drizzle-orm
 *
 */

export * from "./types";

export { Database, createDatabase } from "./database/database";
export { type Datastore } from "./database/datastore";
export { collection, Collection } from "./collection/collection";

export { model, Model } from "./document/document";

export { Relation, relations } from "./relation/relation";
export { HasManyRelation, hasMany } from "./relation/has_many";
export { BelongsToRelation, belongsTo } from "./relation/belongs_to";

export {
  type Query,
  type OperatorValueType,
  type Operator,
} from "./query/query";
export { QueryBuilder } from "./query/query_builder";
export { QueryRunner } from "./query/query_runner";

export { Schema } from "./document/schema";
export { Field } from "./document/field";

export { string, StringField } from "./document/string";
export { array, ArrayField } from "./document/array";
