/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useState } from "react";
import { Button, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import { Code } from "@mui/icons-material";
import { Node, NodeProps, useReactFlow } from "reactflow";
import { ToolSourceHandle } from "../../Common/Handles";
import { v4 } from "uuid";
import SetupDialog from "./dialog";
import { LLMParameters, getDefaultLLMModel, getDefaultLLMParameters } from "../../Common/LLMParameters";


export interface PythonToolNodeProps extends NodeProps {
    data: {
        name: string,
        description: string,
        properties: {
            name: string,
            type: string,
            description: string,
            required: boolean,
        }[],
        code: string,
        state?: "pending" | "completed",
    }
}

export const PythonToolIcon = <Code />;
export const PythonToolLabel = "Python";

/**
 * 
 * @param props 
 * @returns 
 */
export default function PythonToolNode(props: PythonToolNodeProps): React.ReactNode {
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
                title={(<Typography variant="h5">{PythonToolLabel}</Typography>)}
                placement="bottom"
            >
                <IconButton onClick={handleOpen} >
                    <Code fontSize="medium" sx={{ fill: theme.palette.primary.main }} />
                </IconButton>
            </Tooltip>
            <SetupDialog id={`PythonToolDialog-${props.id}`}
                node={props}
                open={open}
                handleClose={handleClose}
            />
        </div>
    )
}

export function getDefaultPythonToolNode(props: any): Node {
    const { id, position } = (props || {});
    return {
        id: id || v4(),
        type: "PythonTool",
        data: {
            name: "current_datetime",
            description: "Get current datetime",
            properties: [{
                name: "timezone",
                type: "string",
                description: "Local timezone, default is 'Asia/Taipei'.",
                required: false,
            }],
            code:"import datetime as dt\nimport pytz\n\ndef current_datetime(timezone):\n\treturn dt.datetime.now(pytz.timezone(timezone))\n",
            state: "pending",
        } as PythonToolNodeProps["data"],
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