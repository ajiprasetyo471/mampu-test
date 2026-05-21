import { Post } from "@/types/post";
import { Todo } from "@/types/todo";

export async function fetchAllPosts(): Promise<Post[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }
  return res.json();
}

export async function fetchAllTodos(): Promise<Todo[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos");
  if (!res.ok) {
    throw new Error("Failed to fetch todos");
  }
  return res.json();
}

export async function fetchUserPosts(userId: number | string): Promise<Post[]> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch posts for user ${userId}`);
  }
  return res.json();
}

export async function fetchUserTodos(userId: number | string): Promise<Todo[]> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos?userId=${userId}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch todos for user ${userId}`);
  }
  return res.json();
}
