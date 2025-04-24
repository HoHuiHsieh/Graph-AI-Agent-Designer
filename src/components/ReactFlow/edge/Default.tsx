/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useCallback } from "react";
import { BaseEdge, EdgeProps, getSimpleBezierPath, useReactFlow } from "reactflow";
import { defaultEdgeStyle } from "./style";



/**
 * 
 * @param param0 
 * @returns 
 */
export default function DefaultEdge(param0: EdgeProps): React.ReactNode {
    const { id, sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, ...props } = param0;
    const { getNode } = useReactFlow();

    // State to manage edge path and label position
    const handleEdgePath = useCallback(() => {
        const sourceNode = getNode(props.source);
        const targetNode = getNode(props.target);
        if (!sourceNode || !targetNode) {
            return null;
        }
        if (sourceNode.position.x < targetNode.position.x) {
            const [edgePath, labelX, labelY] = getSimpleBezierPath({
                sourceX, sourceY, sourcePosition,
                targetX, targetY, targetPosition
            });
            return edgePath
        } else {
            const radiusX = (sourceX - targetX) * 0.6;
            const radiusY = 50;
            const edgePath = `M ${sourceX - 5} ${sourceY} A ${radiusX} ${radiusY} 0 1 0 ${targetX + 2
                } ${targetY}`;
            return edgePath;
        }
    }, [getNode, props.source, props.target, sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition]);

    return (
        <BaseEdge {...props}
            path={handleEdgePath()}
            style={defaultEdgeStyle}
        />
    );
}