import { Pet } from "./Pet";

export class User extends Model {
  declare id: string;
  declare firstname: string;
  declare lastname: string;

  get fullName() {
    return `${this.firstname} ${this.lastname}`;
  }

  override relations() {
    return {
      pets: {
        relatedModel: Pet,
        field: "user_id",
      },
    };
  }
}
