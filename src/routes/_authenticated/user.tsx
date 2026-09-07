import { Typography } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

import { useUser } from "../../features/user/useUser";
import { EmailForm } from "../../features/user/EmailForm";
import { FormSection } from "../../features/user/FormSection";
import { NameForm } from "../../features/user/NameForm";
import { PasswordForm } from "../../features/user/PasswordForm";
import { useTranslations } from "../../context/useTranslations";

export const Route = createFileRoute("/_authenticated/user")({
  component: RouteComponent,
});

function RouteComponent() {
  const t = useTranslations();
  const { data: user, isLoading } = useUser();
  if (isLoading) return <div className="p-6">Loading…</div>;
  if (!user) return <div className="p-6">Failed to load profile</div>;
  return (
    <div className="h-full overflow-y-auto">
      <div className="flex flex-col gap-8 max-w-3xl mx-auto p-6">
        <div className="flex justify-center border-b border-gray-200">
          <Typography variant="h4" component="h1">
            {t.user.profileSettings}
          </Typography>
        </div>
        <FormSection title={t.user.name}>
          <NameForm key={user.id} user={user} />
        </FormSection>
        <FormSection title={t.user.email}>
          <EmailForm key={user.id} user={user} />
        </FormSection>
        <FormSection title={t.user.password}>
          <PasswordForm />
        </FormSection>
      </div>
    </div>
  );
}
