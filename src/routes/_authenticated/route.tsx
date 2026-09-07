import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Header } from "../../components/Header";
import { isTokenExpired } from "../../lib/api";
import { useAuthStore } from "../../features/auth/authStore";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: () => {
    const token = useAuthStore.getState().token;
    if (isTokenExpired(token)) {
      useAuthStore.getState().clearToken();
      throw redirect({ to: "/" });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="flex-1 min-h-0 px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
