import { vueStorage } from "../src";
import { collection, model, relations, string, database } from "salad-orm";

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
    userId: string("userId", "").notNull(),
  });

  const usersRelations = relations(users, ({ hasMany }) => ({
    posts: hasMany(posts, "userId"),
  }));

  const postsRelations = relations(posts, ({ belongsTo }) => ({
    user: belongsTo(users, "userId"),
  }));

  const db = database(
    {
      users: collection(users, usersRelations),
      posts: collection(posts, postsRelations),
    },
    vueStorage()
  );

  return {
    db,
  };
}
