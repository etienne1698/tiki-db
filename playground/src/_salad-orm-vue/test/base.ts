import { createVueDatabase } from "..";
import { belongsTo, hasMany, model, relations, string } from "../../_salad-orm";

export function getTestBase() {

  

  let pets = model("pet", {
    id: string("id", ""),
    user_id: string("user_id", ""),
    name: string("name", ""),
  }, {
    
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
