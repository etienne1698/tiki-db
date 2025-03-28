import { Pet } from "./Pet";

export class User extends Model {
  static override entity = "User";

  declare id: string;
  declare firstname: string;
  declare lastname: string;

  get fullName() {
    return `${this.firstname} ${this.lastname}`;
  }

  static override relations() {
    return {
      pets: {
        relatedModel: Pet,
        field: "user_id",
      },
    };
  }
}

export class UserRepository extends Repository<User> {}
