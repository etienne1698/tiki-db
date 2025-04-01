import { Repository } from "abstracdb";
import database from "./database";
import { Pet } from "./models/Pet";
import { User } from "./models/User";
import { City } from "./models/City";

export default {
  pets: Repository.createWithOptions({ database, use: Pet }),
  users: Repository.createWithOptions({ database, use: User }),
  cities: Repository.createWithOptions({ database, use: City }),
};
