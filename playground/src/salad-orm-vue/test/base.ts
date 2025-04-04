import { createVueDatabase } from "..";
import { model, relations, string } from "../../salad-orm";

export function getTestBase() {
  const users = model("users", {
    id: string("id", ""),
    firstname: string("firstname", ""),
    lastname: string("lastname", ""),
    email: string("email", ""),
    phone: string("phone", ""),
  });

  const db = createVueDatabase({
    users,
    
  });

  return {
    db,
  };
}
