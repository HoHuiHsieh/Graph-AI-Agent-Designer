/**
 * @fileoverview This file defines the FlowPointNode component, a React component 
 * that represents a node in a flow diagram. It includes optional handles for 
 * connecting to other nodes and displays a label. The component is designed to 
 * work with the React Flow library and Material-UI for styling.
 * 
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React from "react";
import { IconButton, Typography } from "@mui/material";
import { Position } from "reactflow";
import { BaseHandle } from "./handle";
import { DefaultNodePropsType } from "./type";
import { targetHandleStyle, sourceHandleStyle, iconButtonStyle, labelStyle } from "./style";
import { usePanel } from "../../provider";
import { getItem } from "../compoments";



/**
 * FlowPointNode component renders a node with optional handles and a label.
 * 
 * @param {DefaultNodePropsType} props - The properties for the node.
 * @returns {React.ReactNode} The rendered node component.
 */
export default function FlowPointNode(props: DefaultNodePropsType): React.ReactNode {
    const { id, data } = props;
    const { type } = data;
    const { setOpenPanel, setOpenChatRoom } = usePanel();
    const Icon = getItem(props.type, data.type).icon;

    //  Handle opening the chat room or panel
    const handleOpen = () =>{
        if (type === "chat") {
            setOpenChatRoom(true);
        } else {
            setOpenPanel(props);
        }
    }

    return (
        <div id={`node-${id}`}>
            {/* Left handle (target) */}
            {type === "end" && (
                <BaseHandle
                    id="flow"
                    type="target"
                    position={Position.Left}
                    maxConnections={10}
                    style={targetHandleStyle}
                />
            )}

            {/* Icon button */}
            <IconButton
                onClick={() => handleOpen()}
                style={iconButtonStyle}
            >
                {Icon}
            </IconButton>

            {/* Right handle (source) */}
            {(type === "start" || type === "chat") && (
                <BaseHandle
                    id="flow"
                    type="source"
                    position={Position.Right}
                    maxConnections={1}
                    style={sourceHandleStyle}
                />
            )}

            {/* Node label */}
            <Typography
                variant="caption"
                align="center"
                style={labelStyle as React.CSSProperties}
            >
                {data.name}
            </Typography>
        </div>
    );
}
