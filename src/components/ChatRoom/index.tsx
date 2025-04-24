/**
 * @fileoverview ChatRoom component for handling chat interactions and workflows.
 * 
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React from "react";
import { Box } from "@mui/material";
import Appbar from "./Appbar";
import Messenger from "./Messenger";


interface ChatRoomProps {
    onClose: () => void;
}

/**
 * ChatRoom component renders the chat room interface with an app bar and messenger.
 * @param param0 
 * @returns 
 */
export default function ChatRoom({ onClose }: ChatRoomProps): React.ReactNode {

    return (
        <Box
            display="flex"
            flexDirection="column"
            sx={{
                width: "100vw",
                height: "100vh",
            }}
        >
            <Appbar onClose={onClose} />
            <Messenger />
        </Box>
    )
}