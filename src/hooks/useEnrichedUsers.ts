import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "@/services/userService";
import { fetchAllPosts, fetchAllTodos } from "@/services/dataService";
import { User } from "@/types/user";

export interface EnrichedUser extends User {
  totalPosts: number;
  completedTodos: number;
  pendingTodos: number;
}

export function useEnrichedUsers() {
  return useQuery<EnrichedUser[]>({
    queryKey: ["enrichedUsers"],
    queryFn: async () => {
      const [users, posts, todos] = await Promise.all([
        fetchUsers(),
        fetchAllPosts(),
        fetchAllTodos(),
      ]);

      return users.map((user) => {
        const userPosts = posts.filter((p) => p.userId === user.id);
        const userTodos = todos.filter((t) => t.userId === user.id);
        const completedCount = userTodos.filter((t) => t.completed).length;

        return {
          ...user,
          totalPosts: userPosts.length,
          completedTodos: completedCount,
          pendingTodos: userTodos.length - completedCount,
        };
      });
    },
  });
}
