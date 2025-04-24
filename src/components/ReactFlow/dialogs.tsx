/**
 * @fileoverview This file contains the WorkplaceDialog and ChatRoomDialog components, 
 * which are used to render different panels and chat rooms in the application.
 * 
 * @author: Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { ReactNode } from "react";
import { Dialog } from "@mui/material";
import ChatRoom from "../ChatRoom";
import { usePanel } from "../provider";
import { getItem } from "./compoments";
import { DATA_TYPES, NODE_TYPES } from "../../types/nodes";

/**
 * Render the appropriate panel based on the openPanel state.
 * @returns {React.ReactNode}
 */
export function WorkplaceDialog(): React.ReactNode {
    const { openPanel } = usePanel();

    switch (openPanel?.data?.type) {
        case DATA_TYPES.REACT_AGENT:
            return getItem(openPanel.type, DATA_TYPES.REACT_AGENT).form;
        case DATA_TYPES.JAVASCRIPT:
            return getItem(openPanel.type, DATA_TYPES.JAVASCRIPT).form;
        case DATA_TYPES.POSTGRESQL:
            return getItem(openPanel.type, DATA_TYPES.POSTGRESQL).form;
        case DATA_TYPES.HTTP:
            return getItem(openPanel.type, DATA_TYPES.HTTP).form;
        case DATA_TYPES.SUBFLOW:
            return getItem(openPanel.type, DATA_TYPES.SUBFLOW).form;
        case DATA_TYPES.START:
            return getItem(openPanel.type, DATA_TYPES.START).form;
        case DATA_TYPES.END:
            return getItem(openPanel.type, DATA_TYPES.END).form;
        case DATA_TYPES.OPENAI:
            return getItem(openPanel.type, DATA_TYPES.OPENAI).form;
        default:
            return <></>;
    }
}

/**
 * Render the chat room dialog.
 * @returns {React.ReactNode}
 */
export function ChatRoomDialog(): ReactNode {
    const { openChatRoom, setOpenChatRoom } = usePanel();

    return (
        <Dialog
            open={openChatRoom}
            onClose={() => setOpenChatRoom(false)}
            fullScreen
            sx={{
                "& .MuiDialog-paper": {
                    backgroundColor: "background.default",
                    color: "text.primary",
                    boxShadow: 24,
                },
            }}
        >
            <ChatRoom onClose={() => setOpenChatRoom(false)} />
        </Dialog>
    );
}
