import { useState, useRef } from "react";
import { Menu, MenuItem, Typography, Divider } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { ExpandMore } from "@mui/icons-material";
import { useUser } from "../features/user/useUser";
import { useLogout } from "../features/auth/useLogout";
import { useTranslations } from "../context/useTranslations";

export function UserMenu() {
  const t = useTranslations();
  const { data: user } = useUser();
  const logout = useLogout();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    closeTimer.current = setTimeout(() => setAnchorEl(null), 150);
  };

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  return (
    <>
      <button
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        className="flex items-center gap-1 px-3 py-2 rounded cursor-pointer
                   transition-colors hover:bg-black/5 active:brightness-90"
      >
        <Typography component="span" sx={{ fontWeight: 500 }}>
          {user?.firstName ?? t.header.account}
        </Typography>
        <ExpandMore fontSize="small" />
      </button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          root: {
            sx: { pointerEvents: "none" },
          },
          list: {
            onMouseEnter: cancelClose,
            onMouseLeave: handleClose,
            sx: {
              pointerEvents: "auto",
              "& .MuiMenuItem-root:active": { filter: "brightness(0.9)" },
            },
          },
        }}
      >
        <MenuItem
          disableRipple
          onClick={() => {
            navigate({ to: "/user" });
            setAnchorEl(null);
          }}
        >
          {t.header.profile}
        </MenuItem>
        <Divider />

        <MenuItem
          disableRipple
          onClick={() => {
            logout();
            setAnchorEl(null);
          }}
        >
          {t.header.logOut}
        </MenuItem>
      </Menu>
    </>
  );
}
