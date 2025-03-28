import { User } from "./User";
import { Relation, Model } from "#imports";

export class City extends Model {
  static override entity = "Pet";

  static override relations(): Record<string, Relation<any>> {
    return { user: Relation.hasMany(User, "city_id") };
  }

  declare id: string;
  declare name: string;
  declare user_id: string;

  declare user?: User;
}
