import { faker } from "@faker-js/faker";

import UserRepository from "../repositories/UserRepository";
import type { City } from "../models/City";

const cities: Partial<City>[] = [];
for (let i = 0; i < 6; i++) {
  cities.push({
    id: faker.string.uuid(),
    name: faker.location.city(),
    country: faker.location.country(),
  } as Partial<City>);
}

function pickCity() {
  const index = Math.floor(Math.random() * 6);
  return cities[index];
}

for (let i = 0; i < 100; i++) {
  const user_id = faker.string.uuid();
  const user: any = {
    id: user_id,
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    city: pickCity(),
  };
  const userHasPet = Boolean(+Math.random().toFixed(0));
  if (userHasPet)
    user.pets = [
      {
        id: faker.string.uuid(),
        name: faker.animal.petName(),
        user_id,
        type: faker.animal.type(),
      },
    ];
  UserRepository.save(user);
}
