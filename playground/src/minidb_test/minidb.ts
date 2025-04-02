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

export type Model<
  T,
  Relations extends Record<string, Relation<unknown>> = {}
> = {
  relations: () => Relations;
  map(data: any, action: MapModelAction): T;
  primaryKey: string | string[];
  entity: string;
};


export type InferMappedModel<T extends Model<unknown>> = ReturnType<T["map"]>;

function model<T, Relations extends Record<string, Relation<unknown>> = {}>({
  primaryKey,
  entity,
  relations,
}: Partial<Model<T, Relations>> & Pick<Model<T, Relations>, "entity">): Model<
  T,
  Relations
> {
  return {
    relations: relations || (() => ({} as Relations)),
    map(data, _action: MapModelAction) {
      return data as T;
    },
    primaryKey: primaryKey || "id",
    entity,
  };
}

// Relations

export abstract class Relation<T, M extends Model<T> = Model<T>> {
  constructor(public related: M, public field: string) {
    this.related = related;
    this.field = field;
  }

  abstract getFor(data: any, database: Database<any>): InferMappedModel<M> | InferMappedModel<M>[];
}

export class HasManyRelation<T, M extends Model<T>> extends Relation<T, M> {
  override getFor(data: any, database: Database<any>): InferMappedModel<M>[] {
    return [];
  }
}

export function hasMany<T, M extends Model<T>>(model: M, field: string) {
  return new HasManyRelation(model, field);
}

// Database

class Database<Models extends Record<string, Model<unknown>>> {
  constructor(public models: Models) {}
}

function createDatabase<Models extends Record<string, Model<unknown>>>(
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

db.models.userSchema.relations().pets.getFor({}, db).map(pet => {
  console.log(pet.user_id); 
});
