import { TextField, Alert } from "@mui/material";
import { useState, type SyntheticEvent } from "react";
import { AxiosError } from "axios";
import { useUpdateEmail } from "./useUserMutations";
import { useAutoReset } from "./useAutoReset";
import Button from "../../components/Button";
import type { User } from "../user/useUser";
import type { ApiError } from "../../lib/api";
import { useTranslations } from "../../context/useTranslations";

export function EmailForm({ user }: Readonly<{ user: User }>) {
  const t = useTranslations();
  const updateEmail = useUpdateEmail();
  useAutoReset(updateEmail.isSuccess, updateEmail.isError, updateEmail.reset);

  const [email, setEmail] = useState(user.email ?? "");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateEmail.mutate(
      { email, currentPassword: password },
      { onSuccess: () => setPassword("") },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {updateEmail.isSuccess && (
        <Alert severity="success">{t.email.emailUpdated}</Alert>
      )}
      {updateEmail.isError && (
        <Alert severity="error">
          {(updateEmail.error as AxiosError<ApiError>).response?.data
            ?.message ?? t.email.failUpdateEmail}
        </Alert>
      )}
      <TextField
        label={t.user.email}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        disabled={updateEmail.isPending}
      />
      <TextField
        label={t.email.currPassword}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        fullWidth
        disabled={updateEmail.isPending}
      />
      <Button
        type="submit"
        buttonVariant="primary"
        sx={{ alignSelf: "flex-start" }}
        disabled={updateEmail.isPending}
      >
        {updateEmail.isPending ? t.email.saving : t.email.changeEmail}
      </Button>
    </form>
  );
}
