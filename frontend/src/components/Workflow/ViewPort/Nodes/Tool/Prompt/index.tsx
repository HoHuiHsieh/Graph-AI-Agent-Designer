/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useState } from "react";
import { Button, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import { EditNote } from "@mui/icons-material";
import { Node, NodeProps, useReactFlow } from "reactflow";
import { ToolSourceHandle } from "../../Common/Handles";
import { v4 } from "uuid";
import SetupDialog from "./dialog";
import { LLMParameters, getDefaultLLMModel, getDefaultLLMParameters } from "../../Common/LLMParameters";


export interface PromptToolNodeProps extends NodeProps {
    data: {
        name: string,
        description: string,
        prompt: string,
        state?: "pending" | "completed",
    }
}

export const PromptToolIcon = <EditNote />;
export const PromptToolLabel = "Prompt";

/**
 * 
 * @param props 
 * @returns 
 */
export default function PromptToolNode(props: PromptToolNodeProps): React.ReactNode {
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
            <ToolSourceHandle id="tool" type="source" />
            <Tooltip
                title={(<Typography variant="h5">{PromptToolLabel}</Typography>)}
                placement="bottom"
            >
                <IconButton onClick={handleOpen} >
                    <EditNote fontSize="medium" sx={{ fill: theme.palette.primary.main }} />
                </IconButton>
            </Tooltip>
            <SetupDialog id={`PromptToolDialog-${props.id}`}
                node={props}
                open={open}
                handleClose={handleClose}
            />
        </div>
    )
}

export function getDefaultPromptToolNode(props: any): Node {
    const { id, position } = (props || {});
    return {
        id: id || v4(),
        type: "PromptTool",
        data: {
            name: "basic_etiquette",
            description: "A set of rules that helps people understand how they should behave.",
            prompt: "Use proper greetings.\nSay 'please' and 'thank you'.\nBe mindful of your language.\nBe a good listener.",
            state: "pending",
        } as PromptToolNodeProps["data"],
        position: position || { x: 0, y: 0 },
        style: {
            background: "#FFF",
            border: "1px solid black",
            borderRadius: 20,
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