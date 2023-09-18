import { User } from "@prisma/client";

export const testAdam: User = {
  id: "0",
  email: "adam@example.com",
  name: "Adam",
};
export const testBob: User = {
  id: "1",
  email: "bob@example.com",
  name: "Bob",
};
export const testCathy: User = {
  id: "2",
  email: "cathy@example.com",
  name: "Cathy",
};
export const testDanny: User = {
  id: "3",
  email: "danny@example.com",
  name: "Danny",
};
export const testEllen: User = {
  id: "4",
  email: "ellen@example.com",
  name: "Ellen",
};

export const fiveUserList: User[] = [
  testAdam,
  testBob,
  testCathy,
  testDanny,
  testEllen,
];

export const fiveUserIdList: string[] = ["0", "1", "2", "3", "4"];
