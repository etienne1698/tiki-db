import { collection, database, model, relations, string } from "..";

const users = model("users", {
  id: string("id", ""),
  name: string("name", "").notNull(),
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

const usersCollection = collection(users, usersRelations);
const postsCollection = collection(posts, postsRelations);

const db = database(
  {
    users: usersCollection,
    posts: postsCollection,
  },
  // @ts-ignore
  {}
);