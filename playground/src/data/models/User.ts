import { City } from "./City";
import { Pet } from "./Pet";
import { Model, Relation } from "../../reexport";
import { Role, RoleUser } from "./Role";

export class User extends Model {
  static override entity = "User";

  static override relations(): Record<string, Relation<any>> {
    return {
      pets: Relation.hasMany(Pet, "user_id"),
      city: Relation.belongsTo(City, "city_id"),
      roles: Relation.belongsToMany(Role, RoleUser, "user_id", "role_id"),
    };
  }

  declare id: string;
  declare firstname: string;
  declare lastname: string;
  declare email: string;
  declare phone: string;
  declare username: string;

  declare city_id: string;

  get fullName() {
    return `${this.firstname || ""} ${this.lastname || ""}`;
  }
}
