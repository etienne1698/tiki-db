import {
  collection,
  model,
  relations,
  string,
  database,
  Storage,
  Constructor,
} from "../src/index";

export function getTestDatabase(storage: Constructor<Storage>) {
  const users = model("usersDbName", {
    id: string("id", ""),
    firstname: string("firstname", ""),
    lastname: string("lastname", ""),
    email: string("email", ""),
    phone: string("phone", ""),
  });
  const posts = model("postsDbName", {
    id: string("id", ""),
    title: string("title", ""),
    content: string("content", ""),
    userId: string("userId", "").notNull(),
  });

  const usersRelations = relations(users, ({ hasMany }) => ({
    posts: hasMany(posts, "userId"),
  }));

  const postsRelations = relations(posts, ({ belongsTo }) => ({
    userqs: belongsTo(users, "userId"),
  }));

  const db = database(
    {
      users: collection(users, usersRelations),
      posts: collection(posts, postsRelations),
    },
    storage
  );

  return {
    db,
  };
}
