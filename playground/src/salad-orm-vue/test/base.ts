import { vueDatabase } from "..";
import { collection, model, relations, string } from "../../salad-orm";

export function getTestBase() {
  const users = model("users", {
    id: string("id", ""),
    firstname: string("firstname", ""),
    lastname: string("lastname", ""),
    email: string("email", ""),
    phone: string("phone", ""),
  });
  const posts = model("posts", {
    id: string("id", ""),
    title: string("title", ""),
    content: string("content", ""),
    userId: string("userId", ""),
  });

  const usersRelations = relations(users, ({ hasMany }) => ({
    posts: hasMany(posts, "userId"),
  }));

  const postsRelations = relations(posts, ({ belongsTo }) => ({
    user: belongsTo(users, "userId"),
  }));

  const db = vueDatabase({
    users: collection(users, usersRelations),
    posts: collection(posts, postsRelations),
  });

  return {
    db,
  };
}
