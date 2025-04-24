/**
 * @fileoverview CommonDialog component for displaying a dialog with dynamic content and fields.
 * 
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Stack,
    MenuItem,
    Select,
    Typography,
} from "@mui/material";
import { WINDOW_SIZE, WindowSizeType } from "../../../type";
import { usePanel } from "../../../provider";


interface CommonDialogProps {
    title: React.ReactNode;
    children?: React.ReactNode;
}

/**
 * CommonDialog component for displaying a dialog with dynamic content and fields.
 * @param param0 
 * @returns 
 */
export default function CommonDialog({ title = "Untitled", children = <div></div> }: CommonDialogProps): React.ReactNode {
    const { openPanel, setOpenPanel, size, setSize } = usePanel();
    const open = Boolean(openPanel);
    const handleClose = (event: React.MouseEventHandler<HTMLButtonElement> | {}) => {
        setOpenPanel(undefined);
    };

    return (
        <Dialog
            maxWidth={size}
            fullWidth
            open={open}
            onClose={handleClose}
            style={{ zIndex: 1001 }}
        >
            <DialogTitle>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    padding={2}
                >
                    {/* Dialog title */}
                    {title}

                    {/* Optional maxWidth selector */}
                    <Select
                        variant="filled"
                        value={size}
                        onChange={(e) => setSize(e.target.value as WindowSizeType)}
                        size="small"
                        style={{ minWidth: 120 }}
                        MenuProps={{
                            PaperProps: {
                                style: { zIndex: 1002 },
                            },
                        }}
                    >
                        {WINDOW_SIZE.map((size) => (
                            <MenuItem key={size} value={size}>
                                width: {size.toUpperCase()}
                            </MenuItem>
                        ))}
                    </Select>
                </Stack>
            </DialogTitle>
            <DialogContent>
                {/* Dialog content */}
                {children}
            </DialogContent>
            <DialogActions>
                {/* Save button */}
                <Button onClick={handleClose} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    )

}