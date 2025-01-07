/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useState } from "react";
import { Button, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import { ExitToApp } from "@mui/icons-material";
import { Node, NodeProps, useReactFlow } from "reactflow";
import { Message } from "@/components/Workflow/typedef";
import { SourceHandle } from "../Common/Handles";
import { v4 } from "uuid";
import SetupDialog from "./dialog";


export interface EntryPointNodeProps extends NodeProps {
    data: {
        messages?: Message[],
        elapsed_time?: number,
        state?: "pending" | "completed",
    }
}

export const EntryPointIcon = <ExitToApp />;
export const EntryPointLabel = "Entry Point";

/**
 * 
 * @param props 
 * @returns 
 */
export default function EntryPointNode(props: EntryPointNodeProps): React.ReactNode {
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
            <Tooltip
                title={(<Typography variant="h5">{EntryPointLabel}</Typography>)}
                placement="bottom"
            >
                <IconButton onClick={handleOpen} >
                    <ExitToApp fontSize="medium" sx={{ fill: theme.palette.primary.main }} />
                </IconButton>
            </Tooltip>
            <SourceHandle id="pipeline" type="source" />
            <SetupDialog id={`EntryPointDialog-${props.id}`}
                node={props}
                open={open}
                handleClose={handleClose}
            />
        </div>
    )
}

export function getDefaultEntryPointNode(props: any): Node {
    const { id, position } = (props || {});
    return {
        id: id || v4(),
        type: "EntryPoint",
        data: {
            messages: [],
            elapsed_time: 0,
            state: "pending",
        } as EntryPointNodeProps["data"],
        position: position || { x: 0, y: 0 },
        style: {
            background: "#FFF",
            border: "1px solid black",
            borderRadius: 2,
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
            fontSize: 12,
            padding: 8,
            paddingLeft: 4,
            width: 45,
            height: 40,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
    }
}