import NuxtDatabase from "./NuxtDatabase";
import { useRuntimeConfig } from "#app";

export default function useDb() {
  const prefix = useRuntimeConfig().public.dbPrefix as string;
  return NuxtDatabase.createWithPrefix(prefix);
}
