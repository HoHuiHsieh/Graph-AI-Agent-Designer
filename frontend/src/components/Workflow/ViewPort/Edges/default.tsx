/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React from "react";
import { CancelOutlined } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { BaseEdge, EdgeLabelRenderer, getSimpleBezierPath, useReactFlow, Position } from "reactflow";



/**
 * default edge component
 * @param props 
 * @returns 
 */
export default function DefaultEdge(props: {
    id?: string,
    sourceX: number,
    sourceY: number,
    sourcePosition: Position,
    targetX: number,
    targetY: number,
    targetPosition: Position,
}): React.ReactNode {
    const { id, sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, ...baseEdgeProps } = props;
    const { setEdges } = useReactFlow();
    const [edgePath, labelX, labelY] = getSimpleBezierPath({
        sourceX, sourceY, sourcePosition,
        targetX, targetY, targetPosition
    });
    return (
        <>
            <BaseEdge id={id}
                path={edgePath}
                {...baseEdgeProps}
                style={{ strokeWidth: 1 }}
            />
            <EdgeLabelRenderer>
                <IconButton
                    style={{
                        position: "absolute",
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        pointerEvents: "all",
                    }}
                    className="nodrag nopan"
                    onClick={() => {
                        setEdges((es) => es.filter((e) => e.id !== id));
                    }}
                    size="small"
                >
                    <CancelOutlined fontSize="small" color="warning" />
                </IconButton>
            </EdgeLabelRenderer>
        </>
    );
}
