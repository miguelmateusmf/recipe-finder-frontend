import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
};

export function useUser() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => api.get<User>("/api/users/me").then((r) => r.data),
    retry: false,
    staleTime: Infinity,
  });
}
