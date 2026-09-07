import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Alert, Typography, TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslations } from "../context/useTranslations";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import Button from "../components/Button";
import { useState, type SyntheticEvent } from "react";
import { useLogin } from "../features/auth/useAuth";
import { Modal } from "../components/Modal";
import { Register } from "../features/auth/Register";
import { isTokenExpired } from "../lib/api";
import { useAutoReset } from "../features/user/useAutoReset";
import { ThemeToggle } from "../components/ThemeToggle";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const stored = localStorage.getItem("auth");
    const token = stored ? JSON.parse(stored).state?.token : null;

    if (!isTokenExpired(token)) {
      throw redirect({ to: "/search" });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const t = useTranslations();
  const theme = useTheme();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registerOpen, setRegisterOpen] = useState(false);
  const login = useLogin();
  useAutoReset(login.isSuccess, login.isError, login.reset);

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    console.log({ username, password });
    login.mutate(
      { email: username, password },
      { onSuccess: () => navigate({ to: "/search" }) },
    );
  };

  return (
    <div className="relative min-h-screen w-full">
      <Modal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        title={t.register.title}
      >
        <Register
          onSuccess={() => {
            setRegisterOpen(false);
            navigate({ to: "/search" });
          }}
        />
      </Modal>
      <header className="flex absolute gap-4 top-0 right-0 p-5">
        <LanguageSwitcher />
        <ThemeToggle />
      </header>

      <main className="flex min-h-screen flex-col items-center justify-center gap-6">
        <Typography variant="h3" sx={{ color: theme.palette.text.primary }}>
          {t.home.title}
        </Typography>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-80"
          noValidate
        >
          {login.isError && (
            <Alert severity="error">Invalid email or password</Alert>
          )}
          <TextField
            label={t.login.username}
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            fullWidth
          />
          <TextField
            label={t.login.password}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            fullWidth
          />
          <Button
            buttonVariant="primary"
            type="submit"
            disabled={login.isPending}
          >
            {login.isPending ? t.home.submitting : t.home.enterSite}
          </Button>
        </form>
        <Button
          buttonVariant="primary"
          type="button"
          onClick={() => setRegisterOpen(!registerOpen)}
        >
          {t.home.register}
        </Button>
      </main>
    </div>
  );
}
