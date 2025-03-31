import { faker } from "@faker-js/faker";

import UserRepository from "../repositories/UserRepository";

for (let i = 0; i < 100; i++) {
  UserRepository.save({
    id: faker.string.uuid(),
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
  });
}
