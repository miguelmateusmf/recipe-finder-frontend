import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "./authStore";

export function useLogout() {
  const clearToken = useAuthStore((s) => s.clearToken);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return () => {
    clearToken();
    queryClient.clear();
    navigate({ to: "/" });
  };
}
