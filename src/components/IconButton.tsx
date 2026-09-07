// components/IconToggleButton/IconToggleButton.tsx
import { IconButton } from "@mui/material";
import type { ReactNode } from "react";

type IconToggleButtonProps = Readonly<{
  active: boolean;
  onClick: () => void;
  activeColor: string;
  inactiveColor?: string;
  activeIcon: ReactNode;
  inactiveIcon: ReactNode;
  ariaLabel: string;
}>;

export function IconToggleButton({
  active,
  onClick,
  activeColor,
  inactiveColor = "text.secondary",
  activeIcon,
  inactiveIcon,
  ariaLabel,
}: IconToggleButtonProps) {
  return (
    <IconButton
      onClick={onClick}
      disableRipple
      aria-label={ariaLabel}
      aria-pressed={active}
      sx={{
        p: 0,
        color: active ? activeColor : inactiveColor,
        transition: "transform 150ms ease",
        "&:hover": {
          transform: "scale(1.1)",
          backgroundColor: "transparent",
        },
      }}
    >
      {active ? activeIcon : inactiveIcon}
    </IconButton>
  );
}
