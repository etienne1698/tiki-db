import {
  collection,
  model,
  relations,
  string,
  syncDatabase,
  InMemoryStorage,
  asyncDatabase,
} from "tiki-db";

import { IndexedDBStorage } from "../../src/index";

import "fake-indexeddb/auto";

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

  const usersRelations = relations(users, ({ hasMany }) => ({
    relatedPosts: hasMany(posts, "userId"),
  }));

  const postsRelations = relations(posts, ({ belongsTo }) => ({
    relatedUser: belongsTo(users, "userId"),
  }));

  const collections = {
    users: collection(users, usersRelations),
    posts: collection(posts, postsRelations),
  };

  const storage = new IndexedDBStorage();
  const db = asyncDatabase(collections, storage);
  
  db.init();

  return {
    db,
  };
}
