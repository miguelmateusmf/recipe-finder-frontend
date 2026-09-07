import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import type { ReactNode } from "react";

type ModalProps = Readonly<{
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
}>;

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = "sm",
}: ModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {title && (
        <DialogTitle
          id="modal-title"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pr: 1,
          }}
        >
          <Typography component="span" variant="h6">
            {title}
          </Typography>
          <IconButton onClick={onClose} aria-label="close" size="small">
            <Close />
          </IconButton>
        </DialogTitle>
      )}

      <DialogContent dividers={!!title}>{children}</DialogContent>
    </Dialog>
  );
}
