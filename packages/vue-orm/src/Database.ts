import { QueryBuilder } from "./QueryBuilder";
import { Model } from "./Model";
import {
  MapModelOptions,
  MaybeAsArray,
  ModelConstructor,
  Primary,
} from "./types";
import { Query } from "./Query";

export abstract class Database {
  query<M extends Model>(model: ModelConstructor<M>): QueryBuilder<M> {
    return new QueryBuilder<M>(this, model);
  }

  map<M extends Model>(
    model: ModelConstructor<M>,
    data: MapModelOptions<Model>
  ) {
    return Object.assign(new model(), data);
  }

  abstract load<M extends Model>(model: ModelConstructor<M>): void;

  abstract get<M extends Model>(model: ModelConstructor<M>, query: Query): M[];

  abstract delete<M extends Model>(
    model: ModelConstructor<M>,

    primary: Primary,
    query?: Query
  ): Partial<M> | undefined;

  abstract update<M extends Model>(
    model: ModelConstructor<M>,
    primary: Primary,
    data: MapModelOptions<M>,
    query?: Query
  ): Partial<M> | undefined;

  abstract insert<M extends Model>(
    model: ModelConstructor<M>,
    data: MaybeAsArray<MapModelOptions<M>>
  ): Partial<M>[];

  abstract save<M extends Model>(
    model: ModelConstructor<M>,
    data: MaybeAsArray<MapModelOptions<M>>,
    saveRelations?: boolean
  ): Partial<M> | Partial<M>[];

  abstract saveOne<M extends Model>(
    model: ModelConstructor<M>,
    data: MapModelOptions<M>,
    saveRelations?: boolean
  ): Partial<M> | undefined;

  abstract saveRelations<M extends Model>(
    model: ModelConstructor<M>,
    data: Record<string, any>
  ): void;
}
