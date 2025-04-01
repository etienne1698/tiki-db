import { faker } from "@faker-js/faker";

import type { City } from "./models/City";
import repositories from "./repositories";
import { flipACoin, pickRandom } from "../utils";

const cities: Partial<City>[] = [];
for (let i = 0; i < 6; i++) {
  cities.push({
    id: faker.string.uuid(),
    name: faker.location.city(),
    country: faker.location.country(),
  } as Partial<City>);
}

for (let i = 0; i < 100; i++) {
  const user_id = faker.string.uuid();
  const city = pickRandom(cities);
  const city_id = city.id as string;
  const user: any = {
    id: user_id,
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    city_id,
    city,
  };
  const userHasPet = flipACoin();
  if (userHasPet)
    user.pets = [
      {
        id: faker.string.uuid(),
        name: faker.animal.petName(),
        user_id,
        type: faker.animal.type(),
      },
    ];
  repositories.users.save(user);
}
