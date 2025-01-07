/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useCallback, useRef } from "react";
import { IconButton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { ClearAll, Home, Undo } from "@mui/icons-material";


interface ActionsProps {
    onClear: React.MouseEventHandler<HTMLButtonElement>,
    onUndo: React.MouseEventHandler<HTMLButtonElement>,
    onClose: () => void,
}

/**
 * 
 * @param props 
 * @returns 
 */
export default function Actions(props: ActionsProps): React.ReactNode {
    const { onClear, onUndo, onClose } = props;

    return (
        <Stack
            direction="row"
            justifyContent="center"
            alignItems="stretch"
            height="5vh"
            spacing={1}
        >
            <Tooltip placement="top"
                title={<Typography variant="h5">Clear</Typography>}
            >
                <IconButton
                    onClick={onClear}
                    style={{ width: "33%" }}
                >
                    <ClearAll fontSize="large" style={{ fill: "#EEEEEE" }} />
                </IconButton>
            </Tooltip>
            <Tooltip placement="top"
                title={<Typography variant="h5">Home</Typography>}
            >
                <IconButton
                    onClick={() => onClose()}
                    style={{ width: "33%" }}
                >
                    <Home fontSize="large" style={{ fill: "#EEEEEE" }} />
                </IconButton>
            </Tooltip>
            <Tooltip placement="top"
                title={<Typography variant="h5">Undo</Typography>}
            >
                <IconButton
                    onClick={onUndo}
                    style={{ width: "33%" }}
                >
                    <Undo fontSize="large" style={{ fill: "#EEEEEE" }} />
                </IconButton>
            </Tooltip>
        </Stack>
    )
}