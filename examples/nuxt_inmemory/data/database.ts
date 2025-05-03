import {
  collection,
  model,
  relations,
  string,
  database,
  InMemoryStorage,
} from "tiki-db";

import { nuxtDatabaseWrapper } from "tiki-db-nuxt";
import { seed } from "./seed";

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

const collections = {
  users: collection(users, usersRelations),
  posts: collection(posts, postsRelations),
};

const storage = new InMemoryStorage();
export const db = nuxtDatabaseWrapper(database(collections, storage));

db.init();

seed(db);
