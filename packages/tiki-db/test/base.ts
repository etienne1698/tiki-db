import {
  collection,
  model,
  relations,
  string,
  database,
  Storage,
  Constructor,
  UselessPersistentStorage,
} from "../src/index";

export function getTestDatabase<S extends Storage<false>>(
  storage: Constructor<S>
) {
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
    storage,
    UselessPersistentStorage
  );

  return {
    db,
  };
}
