/**
 * @fileoverview DefaultNode component for rendering a custom node in React Flow.
 * 
 * Provides a visual representation of a node with customizable handles, an icon button, and a label.
 * 
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React from "react";
import { IconButton, Typography } from "@mui/material";
import { Position } from "reactflow";
import { BaseHandle } from "./handle";
import { getItem } from "../compoments";

import { usePanel } from "../../provider";
import { DefaultNodePropsType } from "./type";
import { targetHandleStyle, sourceHandleStyle, iconButtonStyle, labelStyle } from "./style";

/**
 * DefaultNode component
 * 
 * @param props - The properties for the node, including type and data.
 * @returns A React component representing the node.
 */
export default function DefaultNode(props: DefaultNodePropsType): React.ReactNode {
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
            <IconButton
                onClick={() => setOpenPanel(props)}
                style={iconButtonStyle}
            >
                {Icon}
            </IconButton>

            {/* Right handle (source) */}
            <BaseHandle
                id="flow"
                type="source"
                position={Position.Right}
                maxConnections={10}
                style={sourceHandleStyle}
            />

            {/* Node label */}
            <Typography
                variant="caption"
                align="center"
                style={labelStyle as React.CSSProperties}
            >
                {props.data.name}
            </Typography>
        </div>
    );
}
