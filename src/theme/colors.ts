// Design tokens — source of truth for all colors, spacing, and radii.
// Custom components import from here directly.
// MUI components read via theme.ts, which maps these tokens into MUI's palette.

export const colors = {
  neutral: {
    white: "#ffffff",
    black: "#000000",
    gray100: "#f5f5f5",
    gray400: "#9e9e9e",
  },
  intent: {
    normal: { base: "#ffffff", hover: "#f0f0f0", disabled: "#e0e0e0" },
    warning: { base: "#d32f2f", hover: "#b71c1c", disabled: "#ef9a9a" },
    confirm: { base: "#2e7d32", hover: "#1b5e20", disabled: "#a5d6a7" },
  },
} as const;

export const spacing = { sm: 8, md: 16, lg: 24 } as const;
export const radius = { sm: 4, md: 8, lg: 16 } as const;
