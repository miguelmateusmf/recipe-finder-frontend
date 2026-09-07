import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { useAuthStore } from "./authStore";

type AuthResponse = { token: string };
type LoginRequest = { email: string; password: string };
type RegisterRequest = LoginRequest & { firstName?: string; lastName?: string };

export function useLogin() {
  const setToken = useAuthStore((s) => s.setToken);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (creds: LoginRequest) =>
      api.post<AuthResponse>("/auth/login", creds).then((r) => r.data),
    onSuccess: (data) => {
      setToken(data.token);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useRegister() {
  const setToken = useAuthStore((s) => s.setToken);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterRequest) =>
      api.post<AuthResponse>("/auth/register", data).then((r) => r.data),
    onSuccess: (data) => {
      setToken(data.token);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
