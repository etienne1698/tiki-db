export class Pet extends Model {
  static override entity = "Pet";

  declare id: string;
  declare name: string;
  declare user_id: string;
}
