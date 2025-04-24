/**
 * @fileoverview DefaultForm component for managing and editing node data in a ReactFlow graph.
 * This component provides a dialog interface for updating node properties such as name and handoffs.
 * It uses React's useReducer for state management and integrates with ReactFlow and custom panel hooks.
 * 
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */

// Import React and ReactFlow hooks
import React from "react";
import { useReactFlow } from "reactflow";

// Import Material-UI components and icons
import {TextField} from "@mui/material";

// Import custom types and utilities
import { BaseNodeDataType, DATA_TYPES } from "../../../types/nodes";
import { usePanel } from "../../provider";
import CommonDialog from "./common/dialog";


// Define the state and action types for the reducer
type State = BaseNodeDataType;
type Action =
    | { type: "SET_NAME"; value: string };

// Reducer function to handle state updates
const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "SET_NAME":
            return { ...state, name: action.value };
        default:
            return state;
    }
};

// Initial node data structure
export const initialNodeData: BaseNodeDataType = {
    type: DATA_TYPES.START,
    name: "Default",
    handoffs: {
        items: [],
        useAi: false,
        credName: "",
        model: "",
    },
};

/**
 * DefaultForm component for editing node data.
 * 
 * @returns React.ReactNode
 */
export default function DefaultForm(): React.ReactNode {
    // Context hooks for managing panel state and ReactFlow nodes
    const { setNodes, getEdges } = useReactFlow();
    const { openPanel, credentials } = usePanel();

    // Extract data from the open panel
    const data: State = openPanel?.data || undefined;
    if (!data) {
        console.error("No data available for the PostgreSQL form");
        return null;
    }

    // Use reducer for managing state
    const [state, dispatch] = React.useReducer(reducer, {
        ...initialNodeData,
        ...data,
    });

    // Update node data when the component unmounts
    React.useEffect(() => {
        return () => {
            setNodes((nodes) =>
                nodes.map((node) => {
                    if (node.id === openPanel?.id) {
                        // Update node properties
                        Object.assign(node.data, state);
                    }
                    return node;
                })
            );
        };
    }, [openPanel.id, state, setNodes, getEdges]);

    // Render the dialog with a text field for the node name
    return (
        <CommonDialog
            title={
                <TextField
                    label="Node Name"
                    variant="outlined"
                    size="small"
                    value={state.name}
                    onChange={(e) => dispatch({ type: "SET_NAME", value: e.target.value })}
                />
            }
        />
    );
}