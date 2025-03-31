import { faker } from "@faker-js/faker";

import UserRepository from "../repositories/UserRepository";

for (let i = 0; i < 100; i++) {
  const user_id = faker.string.uuid();
  const user: any = {
    id: user_id,
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
  };
  const userHasPet = Boolean(+Math.random().toFixed(0));
  if (userHasPet) user.pets = [{ id: faker.string.uuid(), name: faker.animal.petName(), user_id }]
  UserRepository.save(user);
}
