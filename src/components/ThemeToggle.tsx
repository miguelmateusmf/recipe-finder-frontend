import { IconButton } from "@mui/material";
import { LightMode, DarkMode } from "@mui/icons-material";
import { useThemeMode } from "../context/useTheme";

export function ThemeToggle() {
  const { mode, toggleMode } = useThemeMode();

  return (
    <IconButton
      onClick={toggleMode}
      aria-label={
        mode === "light" ? "Switch to dark mode" : "Switch to light mode"
      }
      sx={{
        transition: "transform 150ms ease",
        "&:hover": { transform: "scale(1.1)", backgroundColor: "transparent" },
      }}
    >
      {mode === "light" ? <DarkMode /> : <LightMode />}
    </IconButton>
  );
}
