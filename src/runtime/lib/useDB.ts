import Database from "./Database";
import { useState } from "#app";

export default function useDB() {
  const state = useState("database");
  return new Database(state);
}
