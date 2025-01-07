/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useState } from "react";
import { Button, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import { SmartToy } from "@mui/icons-material";
import { Node, NodeProps, useReactFlow } from "reactflow";
import { PlanSourceHandle } from "../../Common/Handles";
import { v4 } from "uuid";
import SetupDialog from "./dialog";
import { LLMParameters, getDefaultLLMModel, getDefaultLLMParameters } from "../../Common/LLMParameters";


export interface LLMPlanNodeProps extends NodeProps {
    data: {
        model: string,
        parameters: LLMParameters,
        iden_prompt: string,
        plan_prompt: string,
        state?: "pending" | "completed",
    }
}

export const LLMPlanIcon = <SmartToy />;
export const LLMPlanLabel = "LLM Planner";

/**
 * 
 * @param props 
 * @returns 
 */
export default function LLMPlanNode(props: LLMPlanNodeProps): React.ReactNode {
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
                title={(<Typography variant="h5">{LLMPlanLabel}</Typography>)}
                placement="bottom"
            >
                <IconButton onClick={handleOpen} >
                    <SmartToy fontSize="medium" sx={{ fill: theme.palette.primary.main }} />
                </IconButton>
            </Tooltip>
            <PlanSourceHandle id="plan" type="source" />
            <SetupDialog id={`LLMPlanDialog-${props.id}`}
                node={props}
                open={open}
                handleClose={handleClose}
            />
        </div>
    )
}

export function getDefaultLLMPlanNode(props: any): Node {
    const { id, position } = (props || {});
    return {
        id: id || v4(),
        type: "LLMPlan",
        data: {
            model: getDefaultLLMModel(),
            parameters: getDefaultLLMParameters(),
            iden_prompt: "Your task is to extract one or more questions from user's message. Your response is a list of the questions. If you don't find any question in the message or you are not sure, repeat the message in your response.\n\nUser's message: {{ message }}\n\nYour response:",
            plan_prompt: "Your task is to make a plan list to solve the questions from user's message. Your plan should select from the possible solutions. Your response is a numbered list of solutions in the format:\n'''\nStep 1. <solution1>(arg1=<value1>,...)\n...\nStep n. end_of_steps()\n'''\n\nPossible solutions:\n'''\n{{ methods }}\n'''\n\nYour response:",
            state: "pending",
        } as LLMPlanNodeProps["data"],
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