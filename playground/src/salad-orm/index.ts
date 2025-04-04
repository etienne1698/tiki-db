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

export { Database, database } from "./database/database";
export { Storage } from "./database/storage";
export { collection, Collection } from "./collection/collection";

export { model, Model } from "./model/model";

export { Relation, Relations, relations } from "./relation/relation";
export { HasManyRelation, hasMany } from "./relation/has_many";
export { BelongsToRelation, belongsTo } from "./relation/belongs_to";

export {
  type Query,
  type OperatorValueType,
  type Operator,
} from "./query/query";
export { QueryBuilder } from "./query/query_builder";
export { QueryRunner } from "./query/query_runner";

export { Schema } from "./model/schema";
export { Field } from "./model/field";

export { string, StringField } from "./model/string";
export { array, ArrayField } from "./model/array";