import { TextField, Alert } from "@mui/material";
import { useState, type SyntheticEvent } from "react";
import { useRegister } from "./useAuth";
import { useTranslations } from "../../context/useTranslations";
import Button from "../../components/Button";

type RegisterProps = Readonly<{
  onSuccess: () => void;
}>;

export function Register({ onSuccess }: RegisterProps) {
  const t = useTranslations();
  const register = useRegister();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const passwordsMatch =
    confirmPassword.length === 0 || password === confirmPassword;

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) return;

    register.mutate({ email, password, firstName, lastName }, { onSuccess });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 pt-2"
      noValidate
    >
      {register.isError && <Alert severity="error">{t.register.error}</Alert>}

      <div className="flex flex-col gap-4 sm:flex-row">
        <TextField
          label={t.register.firstName}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          autoComplete="given-name"
          fullWidth
          disabled={register.isPending}
        />
        <TextField
          label={t.register.lastName}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          autoComplete="family-name"
          fullWidth
          disabled={register.isPending}
        />
      </div>

      <TextField
        label={t.register.email}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        required
        fullWidth
        disabled={register.isPending}
      />

      <TextField
        label={t.register.password}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
        required
        fullWidth
        disabled={register.isPending}
        helperText={t.register.passwordHint}
      />

      <TextField
        label={t.register.confirmPassword}
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        autoComplete="new-password"
        required
        fullWidth
        disabled={register.isPending}
        error={!passwordsMatch}
        helperText={!passwordsMatch ? t.register.passwordMismatch : ""}
      />

      <Button
        type="submit"
        buttonVariant="primary"
        disabled={register.isPending || !passwordsMatch}
      >
        {register.isPending ? t.register.submitting : t.register.submit}
      </Button>
    </form>
  );
}
