import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ThemeModeProvider } from "../context/themeProvider";
import { LanguageProvider } from "../context/languageProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: () => (
    <ThemeModeProvider>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <Outlet />
          {import.meta.env.DEV && <TanStackRouterDevtools />}
        </LanguageProvider>
      </QueryClientProvider>
    </ThemeModeProvider>
  ),
});
