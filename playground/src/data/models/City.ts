import { Model, Relation } from "abstracdb";
import { User } from "./User";

export class City extends Model {
  static override entity = "City";

  static override relations(): Record<string, Relation<any>> {
    return {
      users: Relation.hasMany(User, "city_id"),
    };
  }

  declare id: string;
  declare name: string;
  declare country: string;
}