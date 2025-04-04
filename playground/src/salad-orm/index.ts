/**
 * README 👋
 *
 * `SaladORM` is a lightweight abstraction layer for data access in Javascript/Typescript applications, with great Typescript support.
 * It provides a structured way to interact with data models and relationships while remaining storage-agnostic.
 *
 *
 * Inspirations:
 * - https://github.com/pubkey/rxdb
 * - https://github.com/drizzle-team/drizzle-orm
 *
 */

export * from "./types";

export { model, Model } from "./model/model";
export { Field } from "./model/field";
export { string, StringField } from "./model/string";
export { array, ArrayField } from "./model/array";

export { Relation, Relations } from "./relation/relation";
export { relations } from "./relation/relation_functions";
export { HasManyRelation, hasMany } from "./relation/has_many";
export { BelongsToRelation, belongsTo } from "./relation/belongs_to";

export { collection, Collection } from "./collection/collection";

export { Storage } from "./storage/storage";

export { Database, database } from "./database/database";

export {
  type Query,
  type FiltersValueType as OperatorValueType,
  type Filters as Operator,
} from "./query/query";
export { QueryBuilder } from "./query/query_builder";
export { QueryRunner } from "./query/query_runner";
