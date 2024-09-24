/**
 * add base node handler component
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useCallback } from "react";
import { Tooltip, Typography } from "@mui/material";
import { Handle, Position, useReactFlow, getConnectedEdges, Connection } from "reactflow";
import { NodeHandleProps } from ".";


/**
 * base node handler component
 * @param props 
 * @returns 
 */
export default function NodeHandle(props: NodeHandleProps): React.ReactNode {
    const { type, datatype } = props;
    const position = () => {
        switch (type) {
            case "source":
                return Position.Right;
            case "target":
                return Position.Left;
            default:
                throw Error("Invilid layout!");
        }
    }
    const color = () => {
        switch (datatype) {
            case "system":
                return "#FF00BD"

            case "instruction":
                return "#F2CA19"

            case "prompt":
                return "#0057E9"

            case "assistant":
                return "#0af5f5"

            case "function":
                return "#87E911"

            default:
                return "#FFF";
        }
    }
    const title = () => {
        switch (datatype) {
            case "system":
                return "系統提示"

            case "instruction":
                return "說明資訊"

            case "prompt":
                return "使用者提示"

            case "assistant":
                return "AI助理回覆"

            case "function":
                return "功能呼叫"

            default:
                return "";
        }
    }

    const useValidatorFn = () => {
        const { getNode, getEdges } = useReactFlow();
        return useCallback(
            (connection: Connection) => {
                if (!connection?.target) { return false }
                if (!connection?.source) { return false }

                // check handler should be the same.
                if (connection.sourceHandle != connection.targetHandle) {
                    // console.error("check handler type being the same.");
                    return false
                }

                // should not connect to the same node.
                if (connection.source === connection.target) {
                    return false
                }

                // check nodes
                const targetNode = getNode(connection?.target),
                    sourceNode = getNode(connection?.source);
                if (!targetNode) { return false }
                if (!sourceNode) { return false }

                // should not connect to nodes with the same type
                if (sourceNode.type === targetNode.type) {
                    // console.error("check node type should not be the same.");
                    return false
                }

                // check maximum connection
                const edges = getConnectedEdges([targetNode], getEdges());
                const count = edges.reduce((num, e) => {
                    if (e.sourceHandle === connection.sourceHandle || e.targetHandle === connection.targetHandle) {
                        if (e.target == connection.target) {
                            num += 1;
                        }
                    }
                    return num
                }, 0)
                return count < props.maxConnections
            },
            [getNode, getEdges]
        );
    };
    return (
        <Tooltip title={(
            <Typography variant="caption">
                {title()}
            </Typography>
        )}  >
            <Handle
                id={props.id}
                type={type}
                position={position()}
                style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "4px",
                    background: color(),
                    top: `${props.shift * 100}%`
                }}
                isValidConnection={useValidatorFn()}
            />
        </Tooltip>
    )
}
