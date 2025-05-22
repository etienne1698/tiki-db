import {
  collection,
  model,
  relations,
  string,
  database,
  InMemoryStorage,
} from "../..";

import { vueDatabaseWrapper } from "../../src/reactive/vue";

export function getTestDatabase() {
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
    relatedPosts: many(posts, {
      fields: ["id"],
      references: ["userId"],
    }),
  }));

  const postsRelations = relations(posts, ({ one }) => ({
    relatedUser: one(users, {
      fields: ["userId"],
      references: ["id"],
    }),
  }));

  const collections = {
    users: collection(users, usersRelations),
    posts: collection(posts, postsRelations),
  };

  const storage = new InMemoryStorage();
  const db = vueDatabaseWrapper(database(collections, storage));

  db.init();

  return {
    db,
  };
}
