/**
 * @fileoverview 
 * 
 * @description ToolNode component for rendering a custom node in ReactFlow.
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React from "react";
import { IconButton, Typography } from "@mui/material";
import { Position } from "reactflow";
import { BaseHandle } from "./handle";
import { getItem } from "../compoments";

import { usePanel } from "../../provider";
import { DefaultNodePropsType } from "./type";
import { iconButtonStyle, labelStyle, modelHandleStyle } from "./style";



/**
 * ModelNode component
 * 
 * @param {DefaultNodePropsType} props - Props for the ModelNode component
 * @returns {React.ReactNode} React component for the ModelNode
 */
export default function ModelNode(props: DefaultNodePropsType): React.ReactNode {
    const { setOpenPanel } = usePanel();
    const Icon = getItem(props.type, props.data.type).icon;

    return (
        <div id={`node-${props.id}`}>
            {/* Top handle (target) */}
            <BaseHandle id="model"
                type="target"
                position={Position.Top}
                maxConnections={1}
                style={modelHandleStyle}
            />

            {/* Icon button */}
            <IconButton
                onClick={() => setOpenPanel(props)}
                style={iconButtonStyle}
            >
                {Icon}
            </IconButton>

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
