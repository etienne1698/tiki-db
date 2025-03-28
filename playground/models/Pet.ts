import { User } from "./User";
import { Relation, Model } from "#imports";

export class Pet extends Model {
  static override entity = "Pet";

  static override relations(): Record<string, Relation> {
    return { user: Relation.belongsTo(User, "user_id") };
  }

  declare id: string;
  declare name: string;
  declare user_id: string;

  declare user?: User;
}
