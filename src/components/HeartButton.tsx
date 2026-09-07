import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { IconToggleButton } from "../components/IconButton";

type HeartButtonProps = Readonly<{
  active: boolean;
  onClick: () => void;
  ariaLabel?: string;
}>;

export function HeartButton({
  active,
  onClick,
  ariaLabel = "toggle favorite",
}: HeartButtonProps) {
  return (
    <IconToggleButton
      active={active}
      onClick={onClick}
      activeColor="error.main"
      ariaLabel={ariaLabel}
      activeIcon={<Favorite sx={{ fontSize: "inherit" }} />}
      inactiveIcon={<FavoriteBorder sx={{ fontSize: "inherit" }} />}
    />
  );
}
