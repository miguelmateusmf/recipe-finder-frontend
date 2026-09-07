// src/theme/theme.ts
import { createTheme, type PaletteMode } from "@mui/material/styles";

const lightPalette = {
  mode: "light" as const,
  primary: {
    main: "#2A7F7F", // muted teal
    light: "#4DA5A5",
    dark: "#1F5F5F",
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#C97B4C", // warm terracotta
    light: "#E09B70",
    dark: "#9F5D36",
    contrastText: "#FFFFFF",
  },
  warning: {
    main: "#C97B4C", // deeper amber-terracotta
    dark: "#9F5D36",
    contrastText: "#FFFFFF",
  },
  success: {
    main: "#5A8A4C", // muted olive-green
    dark: "#436A38",
    contrastText: "#FFFFFF",
  },
  background: {
    default: "#FAF7F2", // warm off-white
    paper: "#FFFFFF",
  },
  text: {
    primary: "#2B2A28", // warm near-black
    secondary: "#6B6863", // warm gray
  },
};

const darkPalette = {
  mode: "dark" as const,
  primary: {
    main: "#5FB8B8", // brighter teal for dark bg
    light: "#82CACA",
    dark: "#3E8F8F",
    contrastText: "#0F1817",
  },
  secondary: {
    main: "#E09B70", // warmer terracotta on dark
    light: "#EAB595",
    dark: "#B37850",
    contrastText: "#0F1817",
  },
  warning: {
    main: "#E09B70",
    dark: "#B37850",
    contrastText: "#0F1817",
  },
  success: {
    main: "#8FB37E", // softer olive on dark
    dark: "#6D8C5E",
    contrastText: "#0F1817",
  },
  background: {
    default: "#1A1D1C", // warm dark, not pure black
    paper: "#232726",
  },
  text: {
    primary: "#EDE8DF",
    secondary: "#A8A29A",
  },
};

export const createAppTheme = (mode: PaletteMode) =>
  createTheme({
    palette: mode === "light" ? lightPalette : darkPalette,
    typography: {
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
    },
    shape: {
      borderRadius: 6,
    },
  });
