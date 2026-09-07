import { useNavigate } from "@tanstack/react-router";
import { UserMenu } from "./UserMenu";
import LanguageSwitcher from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { useTranslations } from "../context/useTranslations";
import {
  useMediaQuery,
  IconButton,
  Drawer,
  MenuItem,
  Divider,
  MenuList,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useState } from "react";
import { useLogout } from "../features/auth/useLogout";

export function Header() {
  const isMobile = useMediaQuery("(max-width:1024px)");
  return isMobile ? <MobileHeader /> : <DesktopHeader />;
}

function DesktopHeader() {
  const t = useTranslations();
  const navigate = useNavigate();
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
      <div className="flex-1" />
      <div className="flex-1 flex justify-center">
        <button
          type="button"
          onClick={() => navigate({ to: "/search" })}
          className="font-semibold px-3 py-2 rounded cursor-pointer
               transition-colors hover:bg-black/5 active:scale-95"
        >
          {t.header.search}
        </button>
      </div>
      <div className="flex-1 flex justify-end gap-3">
        <LanguageSwitcher />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}

function MobileHeader() {
  const navigate = useNavigate();
  const logout = useLogout();
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  const go = (to: string) => {
    navigate({ to });
    setOpen(false);
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
      <button
        onClick={() => navigate({ to: "/search" })}
        className="font-semibold px-2 py-2 rounded cursor-pointer transition-colors hover:bg-black/5 active:brightness-90"
      >
        {t.header.search}
      </button>

      <IconButton onClick={() => setOpen(true)} aria-label="open menu">
        <MenuIcon />
      </IconButton>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <div className="w-64 p-2">
          <MenuList>
            <MenuItem onClick={() => go("/search")}>{t.header.search}</MenuItem>
            <MenuItem onClick={() => go("/user")}>{t.header.profile}</MenuItem>
            <Divider />
            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-sm">{t.language}</span>
              <LanguageSwitcher />
            </div>
            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-sm">{t.header.theme}</span>
              <ThemeToggle />
            </div>
            <Divider />
            <MenuItem
              onClick={() => {
                logout();
                setOpen(false);
              }}
            >
              {t.header.logOut}
            </MenuItem>
          </MenuList>
        </div>
      </Drawer>
    </header>
  );
}

export default Header;
