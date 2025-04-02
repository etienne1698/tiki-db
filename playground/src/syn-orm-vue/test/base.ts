import { createVueDatabase } from "../";
import { hasMany, model, string } from "../../syn-orm/";

export function getTestBase() {
  const pets = model("pet", {
    id: string("id", ""),
    user_id: string("user_id", ""),
    name: string("name", ""),
  });
  const users = model(
    "users",
    {
      id: string("id", ""),
      firstname: string("firstname", ""),
      lastname: string("lastname", ""),
      email: string("email", ""),
      phone: string("phone", ""),
    },
    {
      relations() {
        return {
          pets: hasMany(pets, "user_id"),
        };
      },
    }
  );

  const db = createVueDatabase({
    users,
    pets,
  });

  return {
    db,
  };
}
