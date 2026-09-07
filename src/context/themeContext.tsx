import { createContext } from "react";

type ThemeMode = "light" | "dark";

type ThemeModeContextType = {
  mode: ThemeMode;
  toggleMode: () => void;
};

export const ThemeModeContext = createContext<ThemeModeContextType | null>(
  null,
);
