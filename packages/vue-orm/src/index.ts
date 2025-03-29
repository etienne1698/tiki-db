import { VueDatabase, Database as DB } from "./Database";
import Model from "./Model";
import QueryBuilder, {
  type OperatorValueType as OpValType,
  type Operator as Op,
} from "./QueryBuilder";
import Relation, {
  BelongsToRelation,
  HasManyRelation,
  HasOneRelation,
} from "./Relation";
import Repository, { type RepositoryOptions as RepoOpts } from "./Repository";
import "./types";

export type Database = DB;
export type RepositoryOptions = RepoOpts;
export type OperatorValueType = OpValType;
export type Operator = Op;

export default {
  VueDatabase,
  Relation,
  HasManyRelation,
  HasOneRelation,
  BelongsToRelation,
  Repository,
  Model,
  QueryBuilder,
};
