/**
 * @fileoverview This file contains the implementation of the BaseHandle component,
 * which is a custom React Flow handle with validation logic for connections.
 * 
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useCallback } from "react";
import { HandleProps, useReactFlow, Connection, getConnectedEdges, Handle } from "reactflow";


interface BaseHandleProps extends HandleProps {
    style?: React.CSSProperties,
    maxConnections: number,
}

/**
 * BaseHandle component provides a customized React Flow handle with built-in
 * connection validation based on handle types and maximum connections.
 * 
 * @param {BaseHandleProps} props - The component props
 * @param {number} props.maxConnections - Maximum number of connections allowed for this handle
 * @returns {React.ReactNode} - A React Flow Handle component with validation
 */
export function BaseHandle({ maxConnections, ...props }: BaseHandleProps): React.ReactNode {
    const { getNode, getEdges } = useReactFlow();

    // Connection validation function
    const validateConnection = useCallback(
        (connection: Connection): boolean => {
            // Validate connection has source and target
            if (!connection?.source || !connection?.target) {
                return false;
            }

            // Validate handle types match
            if (connection.sourceHandle !== connection.targetHandle) {
                return false;
            }

            // Get nodes involved in the connection
            const sourceNode = getNode(connection.source);
            const targetNode = getNode(connection.target);
            if (!sourceNode || !targetNode) {
                return false;
            }

            // Count existing connections to the target with the same handle type
            const edges = getConnectedEdges([targetNode], getEdges());
            const connectionsCount = edges.filter(edge =>
                edge.target === connection.target &&
                (edge.targetHandle === connection.targetHandle ||
                    edge.sourceHandle === connection.sourceHandle)
            ).length;

            // Allow connection if below the maximum limit
            return connectionsCount < maxConnections;
        },
        [getNode, getEdges, maxConnections]
    );

    return (
        <Handle
            {...props}
            isValidConnection={validateConnection}
        />
    );
}
