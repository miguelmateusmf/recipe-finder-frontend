import { TextField, Alert } from "@mui/material";
import { useState, type SyntheticEvent } from "react";
import { useUpdateProfile } from "./useUserMutations";
import { useAutoReset } from "./useAutoReset";
import Button from "../../components/Button";
import type { User } from "../user/useUser";
import { useTranslations } from "../../context/useTranslations";

export function NameForm({ user }: Readonly<{ user: User }>) {
  const t = useTranslations();
  const updateProfile = useUpdateProfile();
  useAutoReset(
    updateProfile.isSuccess,
    updateProfile.isError,
    updateProfile.reset,
  );

  const [firstName, setFirstName] = useState(user.firstName ?? "");
  const [lastName, setLastName] = useState(user.lastName ?? "");

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateProfile.mutate({ firstName, lastName });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {updateProfile.isSuccess && (
        <Alert severity="success">{t.name.nameUpdated}</Alert>
      )}
      {updateProfile.isError && (
        <Alert severity="error">{t.name.failUpdateName}</Alert>
      )}
      <div className="flex flex-col gap-3 sm:flex-row">
        <TextField
          label={t.name.firstName}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          fullWidth
          disabled={updateProfile.isPending}
        />
        <TextField
          label={t.name.lastName}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          fullWidth
          disabled={updateProfile.isPending}
        />
      </div>
      <Button
        type="submit"
        buttonVariant="primary"
        sx={{ alignSelf: "flex-start" }}
        disabled={updateProfile.isPending}
      >
        {updateProfile.isPending ? t.name.saving : t.name.changeName}
      </Button>
    </form>
  );
}
