import { Close } from "@mui/icons-material";
import { IconToggleButton } from "../components/IconButton";

type RemoveButtonProps = Readonly<{
  onClick: () => void;
  ariaLabel?: string;
}>;

export function RemoveButton({
  onClick,
  ariaLabel = "remove",
}: RemoveButtonProps) {
  return (
    <IconToggleButton
      active={false}
      onClick={onClick}
      activeColor="error.main"
      inactiveColor="text.secondary"
      ariaLabel={ariaLabel}
      activeIcon={<Close sx={{ fontSize: "inherit" }} />}
      inactiveIcon={<Close sx={{ fontSize: "inherit" }} />}
    />
  );
}
