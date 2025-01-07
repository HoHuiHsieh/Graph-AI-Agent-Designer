/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useCallback, useRef, useState } from "react";
import ReactFlow, {
    Node,
    Edge,
    Background,
    BackgroundVariant,
    Controls,
    OnConnect,
    OnEdgeUpdateFunc,
    addEdge,
    reconnectEdge,
    useReactFlow,
    OnNodesChange,
    OnEdgesChange,
    applyNodeChanges,
    applyEdgeChanges,
    NodeDragHandler,
} from "reactflow";
import "reactflow/dist/style.css";
import { Box, useTheme } from "@mui/material";
import NodeMenuButton from "./Menu";
import { nodeTypes } from "./Nodes";
import { edgeTypes } from "./Edges";
import { defaultNodes, defaultEdges } from "./default";
import { str2color } from "./utils";


/**
 * workflow editor component
 * @param props 
 * @returns 
 */
export default function ViewPort({ height }: { height: string }): React.ReactNode {
    const { screenToFlowPosition, getIntersectingNodes } = useReactFlow();
    const [nodes, setNodes] = useState<Node[]>(defaultNodes);
    const [edges, setEdges] = useState<Edge[]>(defaultEdges);
    const theme = useTheme();

    // Handle changes
    const onNodesChange: OnNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes],
    );
    const onEdgesChange: OnEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges],
    );
    const onConnect: OnConnect = useCallback(
        (params) => setEdges((els) => addEdge({ ...params, type: params.sourceHandle }, els)),
        [setEdges]
    );

    // Handle edge changed
    const edgeUpdateSuccessful = useRef(true);
    const onEdgeUpdateStart = useCallback(() => {
        edgeUpdateSuccessful.current = false;
    }, [edgeUpdateSuccessful]);
    const onEdgeUpdate: OnEdgeUpdateFunc = useCallback(
        (oldEdge, params) => {
            edgeUpdateSuccessful.current = true;
            setEdges((els) => reconnectEdge(oldEdge, params, els))
        },
        [edgeUpdateSuccessful, setEdges]
    );
    const onEdgeUpdateEnd = useCallback(
        (e: any, edge: Edge) => {
            if (!edgeUpdateSuccessful.current) {
                setEdges((eds) => eds.filter((e) => e.id !== edge.id));
            }
            edgeUpdateSuccessful.current = true;
        },
        [edgeUpdateSuccessful, setEdges]
    );

    // Handle drag node
    const connectingNodeId = useRef<string | null>(null);
    const intersectingNode = useRef<Node>(null);
    const sortNodes = (node: Node, nodes: Node[]) => {
        nodes = [...nodes].sort((a, b) => {
            if (a.id === node.id) return 1;
            if (b.id === node.id) return -1;
            return 0;
        });
        const children = nodes.filter(n => n.parentId === node.id);
        children.forEach(child => {
            nodes = sortNodes(child, nodes);
        });
        return nodes;
    };
    const findAbsolutePosition = (currentNode: Node, allNodes: Node[]): { x: number, y: number } => {
        if (!currentNode?.parentId) {
            return { x: currentNode.position.x, y: currentNode.position.y };
        }
        const parentNode = allNodes.find(n => n.id === currentNode.parentId);
        if (!parentNode) {
            return { x: currentNode.position.x, y: currentNode.position.y };
        }
        const parentPosition = findAbsolutePosition(parentNode, allNodes);
        return {
            x: parentPosition.x + currentNode.position.x,
            y: parentPosition.y + currentNode.position.y
        };
    };
    const onNodeDragStart: NodeDragHandler = useCallback((evt, node) => {
        connectingNodeId.current = node.id;
        const intersectingNodes = getIntersectingNodes(node, false);
        intersectingNode.current = intersectingNodes[intersectingNodes.length - 1];
    },
        [connectingNodeId, intersectingNode, getIntersectingNodes]
    );
    const onNodeDrag: NodeDragHandler = useCallback((evt, node) => {
        connectingNodeId.current = node.id;
        const intersectingNodes = getIntersectingNodes(node, false);
        intersectingNode.current = intersectingNodes[intersectingNodes.length - 1];
    },
        [connectingNodeId, intersectingNode, getIntersectingNodes]
    )
    const onNodeDragStop: NodeDragHandler = useCallback((evt, node) => {
        const connectingNodeIdCurrent = connectingNodeId?.current;
        const children = nodes.filter(n => n.parentId === node.id);
        let sortedNodes: Node[];
        if (children.length == 0) {
            sortedNodes = [...nodes].sort((a, b) => {
                if (a.id === node.id) return 1;
                if (b.id === node.id) return -1;
                return 0;
            });
        } else {
            sortedNodes = sortNodes(node, nodes);
        }
        setNodes(sortedNodes);
        setNodes((nodes) =>
            nodes.map((n) => {
                let intersectedNode = intersectingNode.current;
                if (n.id === connectingNodeIdCurrent) {
                    const absolutePosition = findAbsolutePosition(n, nodes);
                    if (!intersectingNode || intersectedNode?.type !== "NodeGroup") {
                        return {
                            ...n,
                            parentId: "",
                            position: absolutePosition,
                            style: {
                                ...n.style,
                                background: n.type == "NodeGroup" ? undefined : "#FFF",
                            }
                        };
                    } else if (n.id !== intersectedNode.id && intersectedNode?.type == "NodeGroup") {
                        const targetAbsolutePosition = findAbsolutePosition(intersectedNode, nodes);
                        return {
                            ...n,
                            parentId: intersectedNode.id,
                            position: {
                                x: absolutePosition.x - targetAbsolutePosition.x,
                                y: absolutePosition.y - targetAbsolutePosition.y,
                            },
                            style: {
                                ...n.style,
                                background: n.type == "NodeGroup" ? undefined : str2color(intersectedNode.id),
                            }
                        };
                    }
                }
                return n;
            })
        );
    },
        [nodes, connectingNodeId, intersectingNode, sortNodes, setNodes, findAbsolutePosition]
    )
    return (
        <Box height={height} width="100%">
            <ReactFlow
                id="viewport-reactflow"
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onEdgeUpdateStart={onEdgeUpdateStart}
                onEdgeUpdate={onEdgeUpdate}
                onEdgeUpdateEnd={onEdgeUpdateEnd}
                onNodeDragStart={onNodeDragStart}
                onNodeDrag={onNodeDrag}
                onNodeDragStop={onNodeDragStop}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
                snapToGrid
                style={{
                    color: theme.palette.common.black,
                    backgroundColor: theme.palette.background.default,
                }}
            >
                <Controls />
                <Background variant={BackgroundVariant.Dots} color="#000" />
            </ReactFlow>
            <NodeMenuButton />
        </Box>
    );
}