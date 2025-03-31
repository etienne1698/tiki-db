import { expect, test } from "vitest";
import { getTestBase } from "./base";

test("simple save and retrieve", () => {
  const { usersRepo } = getTestBase();

  usersRepo.save({ id: "123" });

  expect(usersRepo.query().getFirst().id).toBe("123");
});

test("relation should not be saved in entity state", () => {
  const { usersRepo } = getTestBase();

  usersRepo.save({ id: "123", pets: [{ id: "1", user_id: "123" }] });

  // @ts-ignore
  expect(usersRepo.query().getFirst().pets).toBe(undefined);
});

test("relation should be save to the relation entity state", () => {
  const { petsRespo, usersRepo } = getTestBase();

  usersRepo.save({ id: "123", pets: [{ id: "1", user_id: "123" }] });

  expect(petsRespo.query().getFirst().id).toBe("1");
});

test("should be delete", () => {
  const { usersRepo } = getTestBase();

  usersRepo.save({ id: "123" });
  usersRepo.delete("123");

  expect(usersRepo.query().getFirst()).toBe(undefined);
});
