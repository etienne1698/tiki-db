import { VueDatabase, Model, Repository, Relation } from "../src/index";

class User extends Model {
  static override entity = "users";

  static override relations(): Record<string, Relation<any>> {
    return {
      pets: Relation.hasMany(Pet, "user_id"),
    };
  }

  declare id: string;
}

class Pet extends Model {
  static override entity = "users";

  declare id: string;
  declare user_id: string;
}

export function getTestBase() {
  const db = new VueDatabase();

  const usersRepo = Repository.createWithOptions({ use: User, database: db });
  const petsRespo = Repository.createWithOptions({ use: Pet, database: db });

  return {
    db,
    User,
    Pet,
    usersRepo,
    petsRespo,
  };
}
