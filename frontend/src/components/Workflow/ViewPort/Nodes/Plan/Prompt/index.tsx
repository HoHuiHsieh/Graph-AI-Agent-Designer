/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useState } from "react";
import { Button, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import { FormatListNumbered } from "@mui/icons-material";
import { Node, NodeProps, useReactFlow } from "reactflow";
import { PlanSourceHandle } from "../../Common/Handles";
import { v4 } from "uuid";
import SetupDialog from "./dialog";


export interface PromptPlanNodeProps extends NodeProps {
    data: {
        prompt: string,
        state?: "pending" | "completed",
    }
}

export const PromptPlanIcon = <FormatListNumbered />;
export const PromptPlanLabel = "Plan list";

/**
 * 
 * @param props 
 * @returns 
 */
export default function PromptPlanNode(props: PromptPlanNodeProps): React.ReactNode {
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
                title={(<Typography variant="h5">{PromptPlanLabel}</Typography>)}
                placement="bottom"
            >
                <IconButton onClick={handleOpen} >
                    <FormatListNumbered fontSize="medium" sx={{ fill: theme.palette.primary.main }} />
                </IconButton>
            </Tooltip>
            <PlanSourceHandle id="plan" type="source" />
            <SetupDialog id={`PromptPlanDialog-${props.id}`}
                node={props}
                open={open}
                handleClose={handleClose}
            />
        </div>
    )
}

export function getDefaultPromptPlanNode(props: any): Node {
    const { id, position } = (props || {});
    return {
        id: id || v4(),
        type: "PromptPlan",
        data: {
            prompt: "Step 1. <action-1>\nStep 2. <action-2>\nStep 3. <action-3>",
            state: "pending",
        } as PromptPlanNodeProps["data"],
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