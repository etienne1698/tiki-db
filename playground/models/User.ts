export class User extends Model {
  declare id: string;
  declare firstname: string;
  declare lastname: string;

  get fullName() {
    return `${this.firstname} ${this.lastname}`;
  }
}
