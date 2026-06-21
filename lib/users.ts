import type { User } from "@/types/user";

// In-memory "database"
let users: User[] = [...initialUsers];

export function createUser(newUser: User) {
  users = [newUser, ...users];
  return newUser;
}