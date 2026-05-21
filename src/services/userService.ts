import { User } from "@/types/user";

export async function fetchUsers(): Promise<User[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }
  return res.json();
}

export async function fetchUserById(id: string | number): Promise<User> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch details for user ${id}`);
  }
  return res.json();
}

