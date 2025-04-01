import { Model, Relation } from "../../reexport";
import { User } from "./User";
import { Pet } from "./Pet";

export class City extends Model {
  static override entity = "City";

  static override relations(): Record<string, Relation<any>> {
    return {
      users: Relation.hasMany(User, "city_id"),
      pets: Relation.hasManyThrough(Pet, User, "user_id", "city_id"),
    };
  }

  declare id: string;
  declare name: string;
  declare country: string;
}