/**
 * workflow editor component
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useCallback, useRef } from "react";
import ReactFlow, {
  Edge,
  Background,
  BackgroundVariant,
  Controls,
  OnConnect,
  OnEdgeUpdateFunc,
  addEdge,
  reconnectEdge,
  useReactFlow,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { v4 as uuidv4 } from "uuid";
import { defaultNodes, defaultEdges } from "./default";
import { styled } from "@mui/material";
import { useWorkSpace } from "../../provider";
import { nodeTypes } from "../Nodes";
import { edgeTypes } from "../Edges";


// styled workspace
const MyReactFlow = styled(ReactFlow)(({ theme }) => ({
  color: theme.palette.common.black,
  backgroundColor: theme.palette.background.default,
}))

/**
 * workflow editor component
 * @returns 
 */
export default function FlowChart(): React.ReactNode {
  const { locking, setLocking } = useWorkSpace();
  const { screenToFlowPosition } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(defaultEdges);
  const edgeUpdateSuccessful = useRef(true);

  // handle edge connection
  const onConnect: OnConnect = useCallback(
    (params) => setEdges((els) => addEdge(params, els)),
    [setEdges]
  );

  // handle remove edge
  // - mouse drag to disconnect
  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, [edgeUpdateSuccessful]);
  // - connect
  const onEdgeUpdate: OnEdgeUpdateFunc = useCallback(
    (oldEdge, params) => {
      edgeUpdateSuccessful.current = true;
      setEdges((els) => reconnectEdge(oldEdge, params, els))
    },
    [edgeUpdateSuccessful, setEdges]
  );
  // - remove edge if not connected
  const onEdgeUpdateEnd = useCallback(
    (e: any, edge: Edge) => {
      if (!edgeUpdateSuccessful.current) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }
      edgeUpdateSuccessful.current = true;
    },
    [edgeUpdateSuccessful, setEdges]
  );

  // drag and drop
  // - drag from toolbox
  const onDragOver: React.DragEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    },
    []
  );
  // - drop in viewport
  const onDrop: React.DragEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      
      // check node type
      if (typeof type === "undefined" || !type) {
        return;
      }
      // check whether a node can be drag-and-drop or not.
      switch (type) {
        case "EntryPoint":
          if (nodes.some((e) => e.type == "EntryPoint")) {
            return;
          }
          break;

        case "ChatRoom":
          if (nodes.some((e) => e.type == "ChatRoom")) {
            return;
          }
          break;

        default:
          break;
      }
      // insert new node
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: uuidv4().toString(),
        type,
        position,
        data: {},
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, setNodes, screenToFlowPosition]
  );

  return (
    <MyReactFlow
      id="main-flow"
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onEdgeUpdate={onEdgeUpdate}
      onEdgeUpdateStart={onEdgeUpdateStart}
      onEdgeUpdateEnd={onEdgeUpdateEnd}
      onConnect={onConnect}
      onDrop={onDrop}
      onDragOver={onDragOver}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      snapToGrid
      edgesUpdatable={!locking}
    >
      <Controls onInteractiveChange={e => setLocking(!e)} />
      <Background variant={BackgroundVariant.Dots} />
    </MyReactFlow>
  );
}


