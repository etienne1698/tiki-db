import { collection, database, model, relations, string } from "..";

const users = model("users", {
  id: string("id", ""),
  name: string("name", "").notNull(),
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

const usersCollection = collection(users, usersRelations);

const db = database(
  {
    users: usersCollection,
  },
  // @ts-ignore
  {}
);
