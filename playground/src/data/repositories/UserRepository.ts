import { Repository } from "abstracdb";
import database from "../database";
import { User } from "../models/User";

export default Repository.createWithOptions({ database, use: User });
