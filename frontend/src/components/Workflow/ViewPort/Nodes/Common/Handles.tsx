/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useCallback } from "react";
import { Tooltip, Typography } from "@mui/material";
import { Connection, getConnectedEdges, Handle, HandleProps, Position, useReactFlow } from "reactflow";
import { TOOL_COLOR, PIPELINE_COLOR, PLAN_COLOR } from "../../default";


interface BaseHandleProps extends HandleProps {
    style: React.CSSProperties,
    maxConnections: number,
    tip?: string,
}

interface CustomHandleProps {
    id: string,
    type: HandleProps["type"],
}

/**
 * 
 * @param props 
 * @returns 
 */
function BaseHandle(props: BaseHandleProps): React.ReactNode {
    const { maxConnections, tip, ...handleprops } = props;
    const useValidatorFn = () => {
        const { getNode, getEdges } = useReactFlow();
        return useCallback(
            (connection: Connection) => {
                if (!connection?.target) { return false };
                if (!connection?.source) { return false };

                // check same handle
                if (connection.sourceHandle !== connection.targetHandle) {
                    return false
                }

                // no self-connection
                if (connection.source === connection.target) {
                    return false
                }

                // check node
                const targetNode = getNode(connection?.target);
                const sourceNode = getNode(connection?.source);
                if (!targetNode) { return false }
                if (!sourceNode) { return false }

                // no same type
                if (sourceNode.type === targetNode.type) {
                    return false
                }

                // check max connection
                const edges = getConnectedEdges([targetNode], getEdges());
                const count = edges.reduce((num, e) => {
                    if (e.sourceHandle === connection.sourceHandle || e.targetHandle === connection.targetHandle) {
                        if (e.target === connection.target) {
                            num += 1;
                        }
                    }
                    return num
                }, 0)
                return count < maxConnections
            }, [getNode, getEdges]
        )
    }
    return (
        <Tooltip
            title={<Typography variant="h5">{tip}</Typography>}
        >
            <Handle {...handleprops} 
                isValidConnection={useValidatorFn()}
            />
        </Tooltip>
    )
}

/**
 * 
 * @param props 
 * @returns 
 */
export function SourceHandle(props: CustomHandleProps): React.ReactNode {
    return (
        <BaseHandle id={props.id} 
            type={props.type}
            position={Position.Right}
            style={{
                width: "10px",
                height: "12px",
                borderRadius: "2px",
                backgroundColor: PIPELINE_COLOR,
                top: "50%",
                right: "-5px"
            }}
            maxConnections={99}
            tip="Pipeline"
        />
    )
}

/**
 * 
 * @param props 
 * @returns 
 */
export function TargetHandle(props: CustomHandleProps): React.ReactNode {
    return (
        <BaseHandle id={props.id} 
            type={props.type}
            position={Position.Left}
            style={{
                width: "10px",
                height: "12px",
                borderRadius: "2px",
                backgroundColor: PIPELINE_COLOR,
                top: "50%",
                left: "-5px"
            }}
            maxConnections={1}
            tip="Pipeline"
        />
    )
}

/**
 * 
 * @param props 
 * @returns 
 */
export function PlanSourceHandle(props: CustomHandleProps): React.ReactNode {
    return (
        <BaseHandle id={props.id} 
            type={props.type}
            position={Position.Bottom}
            style={{
                width: "10px",
                height: "10px",
                borderRadius: "5px",
                borderColor: "#555",
                backgroundColor: PLAN_COLOR,
                left: "50%",
                bottom: "-6px"
            }}
            maxConnections={1}
            tip="Plan"
        />
    )
}

/**
 * 
 * @param props 
 * @returns 
 */
export function PlanTargetHandle(props: CustomHandleProps): React.ReactNode {
    return (
        <BaseHandle id={props.id} 
            type={props.type}
            position={Position.Top}
            style={{
                width: "12px",
                height: "8px",
                borderRadius: "4px",
                borderColor: "#555",
                backgroundColor: PLAN_COLOR,
                left: "25%",
                top: "-4px"
            }}
            maxConnections={1}
            tip="Plan"
        />
    )
}

/**
 * 
 * @param props 
 * @returns 
 */
export function ToolSourceHandle(props: CustomHandleProps): React.ReactNode {
    return (
        <BaseHandle id={props.id} 
            type={props.type}
            position={Position.Top}
            style={{
                width: "10px",
                height: "10px",
                borderRadius: "5px",
                borderColor: "#555",
                backgroundColor: TOOL_COLOR,
                left: "50%",
                top: "-6px"
            }}
            maxConnections={1}
            tip="Tool"
        />
    )
}

/**
 * 
 * @param props 
 * @returns 
 */
export function ToolTargetHandle(props: CustomHandleProps): React.ReactNode {
    return (
        <BaseHandle id={props.id} 
            type={props.type}
            position={Position.Bottom}
            style={{
                width: "12px",
                height: "8px",
                borderRadius: "4px",
                borderColor: "#555",
                backgroundColor: TOOL_COLOR,
                left: "75%",
                bottom: "-4px"
            }}
            maxConnections={99}
            tip="Tool"
        />
    )
}