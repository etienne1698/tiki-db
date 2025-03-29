import { expect, test } from "vitest";
import { getTestBase } from "./base";

test("simple save and retrieve", () => {
  const { usersRespo } = getTestBase();

  usersRespo.save({ id: "123" });

  expect(usersRespo.query().getFirst().id).toBe("123");
});

test("relation should not be saved in entity state", () => {
  const { usersRespo } = getTestBase();

  usersRespo.save({ id: "123", pets: [{ id: "1", user_id: "123" }] });

  // @ts-ignore
  expect(usersRespo.query().getFirst().pets).toBe(undefined);
});

test("relation should be save to the relation entity state", () => {
  const { petsRespo, usersRespo } = getTestBase();

  usersRespo.save({ id: "123", pets: [{ id: "1", user_id: "123" }] });

  expect(petsRespo.query().getFirst().id).toBe("1");
});
