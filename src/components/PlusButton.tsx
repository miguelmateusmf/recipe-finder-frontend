import { Add } from "@mui/icons-material";
import { IconToggleButton } from "../components/IconButton";

type PlusButtonProps = Readonly<{
  active: boolean;
  onClick: () => void;
  ariaLabel?: string;
}>;

export function PlusButton({
  active,
  onClick,
  ariaLabel = "toggle add",
}: PlusButtonProps) {
  return (
    <IconToggleButton
      onClick={onClick}
      active={active}
      activeColor="primary.main"
      ariaLabel={ariaLabel}
      activeIcon={<Add sx={{ fontSize: "inherit" }} />}
      inactiveIcon={<Add sx={{ fontSize: "inherit", opacity: 0.5 }} />}
    />
  );
}
