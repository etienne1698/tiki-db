import { Model, Relation } from "abstracdb";
import { User } from "./User";

export class Pet extends Model {
  static override entity = "Pet";

  static override relations(): Record<string, Relation<any>> {
    return { user: Relation.belongsTo(User, "user_id") };
  }

  declare id: string;
  declare name: string;
  declare user_id: string;

  declare user?: User;
}
