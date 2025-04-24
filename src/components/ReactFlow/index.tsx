"use client"
/**
 * @fileoverview This file contains the ViewPort component which is a workflow editor component using ReactFlow.
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useCallback, useRef } from "react";
import ReactFlow, {
    Node,
    Edge,
    Background,
    BackgroundVariant,
    Controls,
    addEdge,
    reconnectEdge,
    useNodesState,
    useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { IconButton, Box, useTheme } from "@mui/material";
import { PlayCircle } from "@mui/icons-material";
import { nodeTypes } from "./node";
import { edgeTypes } from "./edge";
import { ChatRoomDialog, WorkplaceDialog } from "./dialogs";
import { usePanel } from "../provider";
import { updateHandoffs } from "./compoments/utils";

/**
 * Workflow editor component
 * @returns The ViewPort component
 */
export default function ViewPort(): React.ReactNode {
    const theme = useTheme();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const edgeUpdateSuccessful = useRef<boolean>(true);

    const handleEdgeUpdate = useCallback(
        (oldEdge: Edge, params: any) => {
            setEdges(reconnectEdge(oldEdge, params, edges));
        },
        [edges, setEdges]
    );

    const handleEdgeUpdateEnd = useCallback(
        (_: any, edge: Edge) => {
            if (!edgeUpdateSuccessful.current) {
                setEdges((eds) => eds.filter((e) => e.id !== edge.id));
            }
            edgeUpdateSuccessful.current = true;
        },
        [setEdges]
    );

    const handleConnect = useCallback(
        (params: any) => {
            setEdges((eds) =>
                addEdge({ ...params, type: params?.sourceHandle || undefined }, eds)
            );
        },
        [setEdges]
    );

    // Update node handoffs when edge change
    React.useEffect(() => {
        setNodes((nds) => nds.map((node) => ({
            ...node,
            data: {
                ...node.data,
                handoffs: {
                    ...node.data.handoffs,
                    items: Array.isArray(node.data?.handoffs?.items) ? updateHandoffs(node, nds, edges, node.data.handoffs.items) : [],
                },
            }
        })));
    }, [edges, setNodes]);

    return (
        <Box height="100vh" width="100vw">
            <ReactFlow
                id="viewport"
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={handleConnect}
                onEdgeUpdateStart={() => (edgeUpdateSuccessful.current = false)}
                onEdgeUpdate={handleEdgeUpdate}
                onEdgeUpdateEnd={handleEdgeUpdateEnd}
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
            <PlayButton />
            <WorkplaceDialog />
            <ChatRoomDialog />
        </Box>
    );
}

/**
 * Play button component
 * @returns The PlayButton component
 */
function PlayButton(): React.ReactNode {
    const { setOpenChatRoom } = usePanel();

    return (
        <Box
            position="absolute"
            bottom={16}
            left="50%"
            sx={{ transform: "translateX(-50%)" }}
        >
            <IconButton
                color="secondary"
                onClick={() => setOpenChatRoom(true)}
                sx={{ color: "red" }}
            >
                <PlayCircle fontSize="large" sx={{ transform: "scale(1.5)" }} />
            </IconButton>
        </Box>
    );
}
