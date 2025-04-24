/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useCallback, useState } from "react";
import { CancelOutlined } from "@mui/icons-material";
import { IconButton, styled } from "@mui/material";
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getSimpleBezierPath, MarkerType, useReactFlow } from "reactflow";
import { toolEdgeStyle } from "./style";


const StyledIconButton = styled(IconButton)(({ theme }) => ({
    position: "absolute",
    opacity: 0.5,
    transition: "opacity 0.2s",
    "&:hover": {
        opacity: 1,
        // backgroundColor: theme.palette.action.hover,
    },
}));

/**
 * 
 * @param param0 
 * @returns 
 */
export default function ToolEdge(param0: EdgeProps): React.ReactNode {
    const { id, sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, ...props } = param0;
    const [edgePath, labelX, labelY] = getSimpleBezierPath({
        sourceX, sourceY, sourcePosition,
        targetX, targetY, targetPosition
    });

    return (
        <BaseEdge {...props}
            path={edgePath}
            style={toolEdgeStyle}
        />
    );
}