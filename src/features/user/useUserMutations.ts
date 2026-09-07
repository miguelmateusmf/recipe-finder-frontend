import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";

type UpdateProfileRequest = { firstName: string; lastName: string };
type UpdateEmailRequest = { email: string; currentPassword: string };
type ChangePasswordRequest = { currentPassword: string; newPassword: string };

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfileRequest) =>
      api.put("/api/users/me", data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useUpdateEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateEmailRequest) =>
      api.put("/api/users/me/email", data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) =>
      api.put("/api/users/me/password", data),
  });
}
