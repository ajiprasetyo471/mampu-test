import { useQuery } from "@tanstack/react-query";
import { fetchUserPosts, fetchUserTodos } from "@/services/dataService";
import { Post } from "@/types/post";
import { Todo } from "@/types/todo";

export interface UserActivity {
  posts: Post[];
  todos: Todo[];
}

export function useUserActivity(userId: number | string) {
  return useQuery<UserActivity>({
    queryKey: ["userActivity", userId],
    queryFn: async () => {
      const [posts, todos] = await Promise.all([
        fetchUserPosts(userId),
        fetchUserTodos(userId),
      ]);
      return { posts, todos };
    },
    enabled: !!userId,
  });
}
