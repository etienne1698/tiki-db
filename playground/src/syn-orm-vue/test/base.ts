import { createVueDatabase } from "../";
import { hasMany, model, string } from "../../syn-orm/";

export function getTestBase() {
  const pet = model("pet", {
    id: string("id", ""),
    user_id: string("user_id", ""),
    name: string("name", ""),
  });
  const user = model(
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
          pets: hasMany(pet, "user_id"),
        };
      },
    }
  );

  const db = createVueDatabase({
    user,
    pet,
  });

  return {
    db,
    user,
    pet,
  };
}