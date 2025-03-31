import { Repository } from "abstracdb";
import database from "../database";
import { Pet } from "../models/Pet";

export default Repository.createWithOptions({ database, use: Pet });
