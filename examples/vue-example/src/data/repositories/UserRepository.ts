import { Repository } from "vue-orm.js";
import database from "../database";
import { User } from "../models/User";

const UserRepository = Repository.createWithOptions({ database, use: User });
export default UserRepository;
