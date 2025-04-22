import {
  collection,
  model,
  relations,
  string,
  syncDatabase,
} from "../../src/index";
import { InMemoryStorage } from "../../src/storage/in_memory_storage";

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
    posts: hasMany(posts, "userId"),
  }));

  const postsRelations = relations(posts, ({ belongsTo }) => ({
    userqs: belongsTo(users, "userId"),
  }));

  const collections = {
    users: collection(users, usersRelations),
    posts: collection(posts, postsRelations),
  };

  const storage = new InMemoryStorage();
  const db = syncDatabase(collections, storage);

  return {
    db,
  };
}
