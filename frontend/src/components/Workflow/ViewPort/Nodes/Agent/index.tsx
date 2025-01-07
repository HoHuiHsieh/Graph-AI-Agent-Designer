/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useState } from "react";
import { Button, Typography } from "@mui/material";
import { FaceRetouchingNatural } from "@mui/icons-material";
import { Node, NodeProps, useReactFlow } from "reactflow";
import { Message } from "@/components/Workflow/typedef";
import { getDefaultLLMModel, getDefaultLLMParameters, LLMParameters } from "../Common/LLMParameters";
import { ToolTargetHandle, PlanTargetHandle, SourceHandle, TargetHandle } from "../Common/Handles";
import { v4 } from "uuid";
import SetupDialog from "./dialog";


export interface AgentNodeProps extends NodeProps {
    data: {
        refine_llm: {
            model: string,
            parameters: LLMParameters,
            system: string,
        },
        chat_llm: {
            model: string,
            parameters: LLMParameters,
            system: string,
        },
        messages?: Message[],
        elapsed_time?: number,
        state?: "pending" | "completed",
    }
}

export const AgentIcon = <FaceRetouchingNatural />;
export const AgentLabel = "AI Agent";

/**
 * 
 * @param props 
 * @returns 
 */
export default function AgentNode(props: AgentNodeProps): React.ReactNode {
    const { setNodes } = useReactFlow();

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
            <PlanTargetHandle id="plan" type="target" />
            <ToolTargetHandle id="tool" type="target" />
            <Button
                onClick={handleOpen}
                startIcon={
                    <FaceRetouchingNatural fontSize="large" sx={{ transform: "scale(1.5)" }} />
                }
                sx={{ padding: 1 }}
            >
                <Typography
                    variant="h3"
                    fontSize={14}
                >
                    {AgentLabel}
                </Typography>
            </Button>
            <SourceHandle id="pipeline" type="source" />
            <SetupDialog id={`AgentDialog-${props.id}`}
                node={props}
                open={open}
                handleClose={handleClose}
            />
        </div>
    )
}

export function getDefaultAgentNode(props: any): Node {
    const { id, position } = (props || {});
    return {
        id: id || v4(),
        type: "Agent",
        data: {
            refine_llm: {
                model: getDefaultLLMModel(),
                parameters: getDefaultLLMParameters(),
                system: "Your job is to execute the plan step-by-step.",
            },
            chat_llm: {
                model: getDefaultLLMModel(),
                parameters: getDefaultLLMParameters(),
                system: "You are a helper.",
            },
            messages: [],
            elapsed_time: 0,
            state: "pending",
        } as AgentNodeProps["data"],
        position: position || { x: 0, y: 0 },
        style: {
            background: "#FFF",
            border: "1px solid black",
            borderRadius: 8,
            fontSize: 12,
            padding: 4,
            width: 120,
            height: 60,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
    }
}