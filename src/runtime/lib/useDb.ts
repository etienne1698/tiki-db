import Database from "./Database";
import { useRuntimeConfig } from "#app";

export default function useDb() {
  const prefix = useRuntimeConfig().public.dbPrefix as string;
  return Database.createWithPrefix(prefix);
}
