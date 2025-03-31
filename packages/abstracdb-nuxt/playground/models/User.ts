import { Model, Relation, Repository } from "abstracdb";
import { Pet } from "./Pet";

export class User extends Model {
  static override entity = "User";

  static override relations(): Record<string, Relation<any>> {
    return {
      pets: Relation.hasMany(Pet, "user_id"),
    };
  }

  declare id: string;
  declare firstname: string;
  declare lastname: string;

  get fullName() {
    return `${this.firstname || ""} ${this.lastname || ""}`;
  }
}

export class UserRepository extends Repository<User> {
  override use = User;
}
