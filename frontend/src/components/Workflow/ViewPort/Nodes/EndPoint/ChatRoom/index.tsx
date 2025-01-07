/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useState } from "react";
import { Button, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import { Chat } from "@mui/icons-material";
import { Node, NodeProps, useReactFlow } from "reactflow";
import { ChatRoomMessage } from "@/components/Workflow/typedef";
import { SourceHandle, TargetHandle } from "../../Common/Handles";
import { v4 } from "uuid";
import SetupDialog from "./dialog";


export interface ChatRoomNodeProps extends NodeProps {
    data: {
        prompt: string,
        messages: ChatRoomMessage[],
        elapsed_time?: number,
        state?: "pending" | "completed",
    }
}

export const ChatRoomIcon = <Chat />;
export const ChatRoomLabel = "Chat Room";

/**
 * 
 * @param props 
 * @returns 
 */
export default function ChatRoomNode(props: ChatRoomNodeProps): React.ReactNode {
    const { setNodes } = useReactFlow();
    const theme = useTheme();

    // handle change data
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = (value: any) => {
        setNodes((nodes) => nodes.map((node) => {
            if (node.id == props.id) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        ...(value || {})
                    }
                }
            }
            return node
        }))
        setOpen(false);
    }

    return (
        <div id={`node-${props.id}`} >
            <TargetHandle id="pipeline" type="target" />
            <Tooltip
                title={(<Typography variant="h5">{ChatRoomLabel}</Typography>)}
                placement="bottom"
            >
                <IconButton onClick={handleOpen} >
                    <Chat fontSize="medium" sx={{ fill: theme.palette.primary.main }} />
                </IconButton>
            </Tooltip>
            <SetupDialog id={props.id}
                node={props}
                open={open}
                handleClose={handleClose}
            />
        </div>
    )
}

export function getDefaultChatRoomNode(props: any): Node {
    const { id, position } = (props || {});
    return {
        id: id || v4(),
        type: "ChatRoom",
        data: {
            prompt: "",
            messages: [],
            elapsed_time: 0,
            state: "pending",
        } as ChatRoomNodeProps["data"],
        position: position || { x: 0, y: 0 },
        style: {
            background: "#FFF",
            border: "1px solid black",
            borderRadius: 4,
            fontSize: 12,
            padding: 8,
            width: 40,
            height: 40,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
    }
}