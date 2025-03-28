import Relation from "../../src/runtime/lib/Relation";
import { Pet } from "./Pet";

export class User extends Model {
  static override entity = "User";

  declare id: string;
  declare firstname: string;
  declare lastname: string;

  get fullName() {
    return `${this.firstname} ${this.lastname}`;
  }

  static override relations = {
    pets: Relation.hasMany(Pet, "user_id"),
  };
}

export class UserRepository extends Repository<User> {
  override use = User;
}
