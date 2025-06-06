import { faker } from "@faker-js/faker";
import type { VueDatabaseWrapper } from "tiki-db-vue";
import type { DatabaseFullSchema, Storage } from "tiki-db";

export function seed<
  IsAsync extends boolean = false,
  FullSchema extends DatabaseFullSchema = DatabaseFullSchema,
  S extends Storage<FullSchema, IsAsync> = Storage<FullSchema, IsAsync>
>(database: VueDatabaseWrapper<IsAsync, FullSchema, S>) {
  const users = [];
  const posts = [];

  for (let i = 0; i < 10; i++) {
    const userId = faker.string.uuid();
    const firstname = faker.person.firstName();
    const lastname = faker.person.lastName();
    const email = faker.internet.email({
      firstName: firstname,
      lastName: lastname,
    });
    const phone = faker.phone.number();

    users.push({
      id: userId,
      firstname,
      lastname,
      email,
      phone,
    });

    // Chaque user a entre 1 et 5 posts
    const postCount = faker.number.int({ min: 1, max: 5 });
    for (let j = 0; j < postCount; j++) {
      posts.push({
        id: faker.string.uuid(),
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs({ min: 1, max: 3 }),
        userId,
      });
    }
  }

  database.collections.posts.insertMany(posts);
  database.collections.users.insertMany(users);
}
