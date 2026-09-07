import { Typography } from "@mui/material";
import type { ReactNode } from "react";

type FormSectionProps = Readonly<{
  title: string;
  children: ReactNode;
}>;

export function FormSection({ title, children }: FormSectionProps) {
  return (
    <section className="flex flex-col gap-4 sm:flex-row sm:gap-8">
      <div className="sm:w-1/3">
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
      </div>
      <div className="sm:w-2/3">{children}</div>
    </section>
  );
}
