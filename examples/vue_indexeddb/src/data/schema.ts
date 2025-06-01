import { collection, model, relations, string } from "tiki-db";

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

const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts, {
    fields: ["id"],
    references: ["userId"],
  }),
}));

const postsRelations = relations(posts, ({ one }) => ({
  user: one(users, {
    fields: ["userId"],
    references: ["id"],
  }),
}));

export const collections = {
  users: collection(users, usersRelations),
  posts: collection(posts, postsRelations),
};
