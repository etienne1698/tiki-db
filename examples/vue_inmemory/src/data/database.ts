import {
  collection,
  model,
  relations,
  string,
  database,
  InMemoryStorage,
} from "tiki-db";

import { vueDatabaseWrapper } from "tiki-db-vue";
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

const usersRelations = relations(users, ({ hasMany }) => ({
  posts: hasMany(posts, "userId"),
}));

const postsRelations = relations(posts, ({ belongsTo }) => ({
  user: belongsTo(users, "userId"),
}));

const collections = {
  users: collection(users, usersRelations),
  posts: collection(posts, postsRelations),
};

const storage = new InMemoryStorage();
export const db = vueDatabaseWrapper(database(collections, storage));

db.init();

seed(db);
