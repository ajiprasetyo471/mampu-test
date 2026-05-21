import { useQuery } from "@tanstack/react-query";
import { fetchUserById } from "@/services/userService";

export function useUser(id: string | number) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUserById(id),
    enabled: !!id,
  });
}
