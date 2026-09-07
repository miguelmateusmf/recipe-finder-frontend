import { TextField, Alert } from "@mui/material";
import { useState, type SyntheticEvent } from "react";
import { AxiosError } from "axios";
import { useChangePassword } from "./useUserMutations";
import { useAutoReset } from "./useAutoReset";
import Button from "../../components/Button";
import type { ApiError } from "../../lib/api";
import { useTranslations } from "../../context/useTranslations";

export function PasswordForm() {
  const t = useTranslations();
  const changePassword = useChangePassword();
  useAutoReset(
    changePassword.isSuccess,
    changePassword.isError,
    changePassword.reset,
  );

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordsMatch =
    confirmPassword === "" || newPassword === confirmPassword;

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return;
    changePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {changePassword.isSuccess && (
        <Alert severity="success">{t.password.passwordChanged}</Alert>
      )}
      {changePassword.isError && (
        <Alert severity="error">
          {(changePassword.error as AxiosError<ApiError>).response?.data
            ?.message ?? t.password.failChangePassword}
        </Alert>
      )}
      <TextField
        label={t.password.currPassword}
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        autoComplete="current-password"
        fullWidth
        disabled={changePassword.isPending}
      />
      <TextField
        label={t.password.newPassword}
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        autoComplete="new-password"
        fullWidth
        disabled={changePassword.isPending}
        helperText={t.password.atLeastMsg}
      />
      <TextField
        label={t.password.confirmNewPassword}
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        autoComplete="new-password"
        fullWidth
        disabled={changePassword.isPending}
        error={!passwordsMatch}
        helperText={!passwordsMatch ? t.password.passwordsDontMatch : ""}
      />
      <Button
        type="submit"
        buttonVariant="primary"
        sx={{ alignSelf: "flex-start" }}
        disabled={changePassword.isPending || !passwordsMatch}
      >
        {changePassword.isPending
          ? t.password.saving
          : t.password.changePassword}
      </Button>
    </form>
  );
}
