import { Button as MuiButton, type ButtonProps } from "@mui/material";
import { useTheme } from "@mui/material/styles";

type ButtonVariant = "primary" | "secondary" | "warning" | "success";

type CustomButtonProps = Omit<ButtonProps, "variant" | "color"> & {
  buttonVariant?: ButtonVariant;
};

function Button({
  buttonVariant = "primary",
  sx,
  ...props
}: CustomButtonProps) {
  const theme = useTheme();
  const palette = theme.palette[buttonVariant];

  return (
    <MuiButton
      disableRipple
      {...props}
      sx={{
        backgroundColor: palette.main,
        color: palette.contrastText,
        "&:hover": { backgroundColor: palette.dark },
        "&:active": { filter: "brightness(0.8)" },
        "&.Mui-disabled": {
          backgroundColor: palette.light,
          color: palette.contrastText,
        },
        ...sx,
      }}
    />
  );
}

export default Button;
