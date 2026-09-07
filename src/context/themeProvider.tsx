import { useState, useMemo, useCallback } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { ThemeModeContext } from "./themeContext";
import { createAppTheme } from "../theme/theme";

type ThemeMode = "light" | "dark";

type ThemeProviderProps = Readonly<{
  children: React.ReactNode;
}>;

export function ThemeModeProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem("theme-mode");
    return stored === "dark" ? "dark" : "light";
  });

  const toggleMode = useCallback(() => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme-mode", next);
      return next;
    });
  }, []);

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  const value = useMemo(() => ({ mode, toggleMode }), [mode, toggleMode]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
