import { Model, Relation } from "../../reexport";
import { User } from "./User";

export class Role extends Model {
  static override entity = "Role";

  static override relations(): Record<string, Relation<any>> {
    return {
      users: Relation.belongsToMany(User, RoleUser, "role_id", "user_id"),
    };
  }

  declare id: string;
  declare name: string;
}

export class RoleUser extends Model {
  static override entity = "User";

  static override relations(): Record<string, Relation<any>> {
    return {
      role: Relation.belongsTo(User, "role_id"),
      user: Relation.belongsTo(User, "user_id"),
    };
  }

  declare id: string;
  declare role_id: string;
  declare user_id: string;
}
