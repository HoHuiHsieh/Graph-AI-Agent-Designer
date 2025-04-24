/**
 * @fileoverview 
 * 
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { Position } from "reactflow";
import { BaseHandle } from "./handle";
import { getItem } from "../compoments";
import { usePanel } from "../../provider";
import { AgentNodePropsType } from "./type";
import { targetHandleStyle, sourceHandleStyle, toolHandleStyle, modelHandleStyle } from "./style";


/**
 * 
 * @param props 
 * @returns 
 */
export default function AgentNode(props: AgentNodePropsType): React.ReactNode {
    const { setOpenPanel } = usePanel();
    const Icon = getItem(props.type, props.data.type).icon;

    return (
        <div id={`node-${props.id}`}>
            {/* Left handle (target) */}
            <BaseHandle
                id="flow"
                type="target"
                position={Position.Left}
                maxConnections={10}
                style={targetHandleStyle}
            />

            {/* Icon button */}
            <Button
                style={{
                    width: "100%",
                    height: "100%",
                    left: 0,
                    color: "black",
                    textTransform: 'none',
                }}
                onClick={() => setOpenPanel(props)}
                startIcon={Icon}
            >
                <Box display="flex" flexDirection="column" >
                    <Typography variant="caption"
                        align="center"
                        m={0}
                        p={0}
                    >
                        AI Agent
                    </Typography>
                    <Typography variant="caption"
                        align="center"
                        m={0}
                        p={0}
                        style={{ fontSize: "0.5rem", color: "gray", }}
                    >
                        {props.data.name}
                    </Typography>
                </Box>
            </Button>

            {/* Right handle (source) */}
            <BaseHandle
                id="flow"
                type="source"
                position={Position.Right}
                maxConnections={10}
                style={sourceHandleStyle}
            />

            {/* Tool handle (source) */}
            <BaseHandle id="tool"
                type="source"
                position={Position.Bottom}
                maxConnections={10}
                style={{
                    ...toolHandleStyle,
                    top: undefined,
                    bottom: "-5px",
                    left: "75%",
                }}
            />

            {/* Model handle (source) */}
            <BaseHandle id="model"
                type="source"
                position={Position.Bottom}
                maxConnections={1}
                style={{
                    ...modelHandleStyle,
                    top: undefined,
                    bottom: "-5px",
                    left: "25%",
                }}
            />
        </div>
    );
}
