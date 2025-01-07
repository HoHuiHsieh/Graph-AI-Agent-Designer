/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useState } from "react";
import { Button, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import { FactCheck } from "@mui/icons-material";
import { Node, NodeProps, useReactFlow } from "reactflow";
import { Message } from "@/components/Workflow/typedef";
import { getDefaultLLMModel, getDefaultLLMParameters, LLMParameters } from "../Common/LLMParameters";
import { SourceHandle, TargetHandle } from "../Common/Handles";
import { v4 } from "uuid";
import SetupDialog from "./dialog";


export interface CheckFactNodeProps extends NodeProps {
    data: {
        llm: {
            model: string,
            parameters: LLMParameters,
        },
        tool: {
            name: string,
            description: string,
            properties: {
                name: string,
                type: string,
                description: string,
                required: boolean,
            }[],
        },
        prompt: string,
        messages?: Message[],
        elapsed_time?: number,
        state?: "pending" | "completed",
    }
}

export const CheckFactIcon = <FactCheck />;
export const CheckFactLabel = "Check Fact";

/**
 * 
 * @param props 
 * @returns 
 */
export default function CheckFactNode(props: CheckFactNodeProps): React.ReactNode {
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
                title={(<Typography variant="h5">{CheckFactLabel}</Typography>)}
                placement="bottom"
            >
                <IconButton onClick={handleOpen} >
                    <FactCheck fontSize="medium" sx={{ fill: theme.palette.primary.main }} />
                </IconButton>
            </Tooltip>
            <SourceHandle id="pipeline" type="source" />
            <SetupDialog id={`CheckFactDialog-${props.id}`}
                node={props}
                open={open}
                handleClose={handleClose}
            />
        </div>
    )
}

export function getDefaultCheckFactNode(props: any): Node {
    const { id, position } = (props || {});
    return {
        id: id || v4(),
        type: "CheckFact",
        data: {
            llm: {
                model: getDefaultLLMModel(),
                parameters: getDefaultLLMParameters(),
            },
            tool: {
                name: "check_evidence",
                description: "Check user's message complies with the evidence.",
                properties: [{
                    name: "is_complied",
                    type: "boolean",
                    description: "'false' if not complied; otherwise, 'true'.",
                    required: true,
                }],
            },
            prompt: "Your task is to identify if the user's message is grounded and entailed in the evidence. You will only use the contents of the evidence and not rely on external knowledge. Your answer should be true or false.\n\nEvidence:\n```\n{{ evidence }}\n```\n\nUser's message:\n```\n{{ message }}\n```\n\nYour answer:",
            messages: [],
            elapsed_time: 0,
            state: "pending",
        } as CheckFactNodeProps["data"],
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