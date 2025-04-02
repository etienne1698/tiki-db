/**
 * README 👋
 * MiniDB is a slightly different approach to AbstractDB,
 * with a less class-based design, currently experimental.
 */

// Model

export enum MapModelAction {
  CREATE = 1,
  UPDATE = 2,
}

export type ModelSchema<
  T,
  Relations extends Record<string, Relation<unknown>> = {}
> = {
  relations: () => Relations;
  map(data: any, action: MapModelAction): T;
  primaryKey: string | string[];
  entity: string;
};

export type InferMappedModel<T extends ModelSchema<unknown>> = ReturnType<T["map"]>;

const defaultMap = <T>(data: any, _action: MapModelAction) => data as T;

function model<T, Relations extends Record<string, Relation<unknown>> = {}>({
  primaryKey,
  entity,
  relations,
  map,
}: Partial<ModelSchema<T, Relations>> & Pick<ModelSchema<T, Relations>, "entity">) {
  return {
    relations: (relations || (() => ({} as Relations))) as () => Relations,
    map: map || defaultMap,
    primaryKey: primaryKey || "id",
    entity,
  };
}

// Relations

export abstract class Relation<T, M extends ModelSchema<T> = ModelSchema<T>> {
  constructor(public related: M, public field: string) {
    this.related = related;
    this.field = field;
  }

  abstract getFor(
    data: any,
    database: Database<any>
  ): InferMappedModel<M> | InferMappedModel<M>[];
}

export class HasManyRelation<T, M extends ModelSchema<T>> extends Relation<T, M> {
  override getFor(_data: any, _database: Database<any>): InferMappedModel<M>[] {
    return [];
  }
}

export function hasMany<T, M extends ModelSchema<T>>(model: M, field: string) {
  return new HasManyRelation(model, field);
}

// Database

class Database<Models extends Record<string, ModelSchema<unknown>>> {
  constructor(public models: Models) {}
}

function createDatabase<Models extends Record<string, ModelSchema<unknown>>>(
  model: Models
): Database<Models> {
  return new Database<Models>(model);
}

// TESTs:

const userSchema = model({
  entity: "users",
  relations: () => ({
    pets: hasMany(petSchema, "user_id"),
  }),
});

const petSchema = model<{ user_id: string }>({
  entity: "pets",
});

const db = createDatabase({
  userSchema,
  petSchema,
});

db.models.userSchema
  .relations()
  .pets.getFor({}, db)
  .map((pet) => {
    console.log(pet.user_id);
  });
