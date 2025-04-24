/**
 * @fileoverview  This file contains the implementation of the SubflowForm component, which is responsible for rendering and managing the state of a subflow form in the ReactFlow environment. 
 * It includes functionality for handling node data, updating state using a reducer, and managing interactions with the ReactFlow graph.
 *
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */

import React from "react";
import { useReactFlow } from "reactflow";
import {
    Stack, TextField,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { ExpandMoreSharp } from "@mui/icons-material";
import { ArgumentsType, BaseHandoffType, SubflowNodeDataType, DATA_TYPES, NODE_TYPES } from "../../../types/nodes";
import { usePanel } from "../../provider";
import CommonDialog from "./common/dialog";
import HandoffsEditor from "./common/HandoffsEditor";
import { updateHandoffs } from "./utils";


type State = SubflowNodeDataType

type Action =
    | { type: "SET_NAME"; value: string }
    | { type: "SET_WORKFLOW_ID"; value: string }
    | { type: "SET_ARGUMENTS"; value: ArgumentsType }
    | { type: "SET_DESCRIPTION"; value: string }
    | { type: "SET_HEADOFFS"; value: BaseHandoffType }; // Replace `any` with a more specific type if available

// Improved readability by adding comments, type safety, and consistent formatting

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "SET_NAME":
            return { ...state, name: action.value };
        case "SET_WORKFLOW_ID":
            return { ...state, workflowId: action.value };
        case "SET_HEADOFFS":
            return { ...state, handoffs: action.value };
        default:
            console.warn(`Unhandled action type: ${action.type}`);
            return state;
    }
};

export const initialNodeData: SubflowNodeDataType = {
    type: DATA_TYPES.SUBFLOW,
    name: "Subflow",
    workflowId: "",
    handoffs: {
        items: [],
        useAi: false,
        credName: "",
        model: "",
    },
};

/**
 * SubflowForm component
 * Handles the rendering and state management of the Subflow form.
 */
export default function SubflowForm(): React.ReactNode {
    const { setNodes, getEdges, getNodes } = useReactFlow();
    const { openPanel, credentials } = usePanel();

    // Extract data from the open panel
    const data: State = openPanel?.data || undefined;
    if (!data) {
        console.error("No data available for the Subflow form");
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
                        Object.assign(node.data, {
                            ...state,
                            handoffs: {
                                ...state.handoffs,
                                items: Array.isArray(state?.handoffs?.items)
                                    ? updateHandoffs(node, nodes, getEdges(), state.handoffs.items)
                                    : [],
                            },
                        });
                    }
                    return node;
                })
            );
        };
    }, [openPanel?.id, state, setNodes, getEdges]);

    // Get node id-name pairs for Autocomplete options
    const nodes = getNodes();
    const nodeIdNamePairs = React.useMemo(
        () =>
            nodes
                .filter((node) => node.type === NODE_TYPES.FLOWPOINT && node.data.type === "start")
                .map((node) => ({
                    id: node.id,
                    name: node.data.name,
                })),
        [nodes]
    );

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
        >
            <Stack
                direction="column"
                justifyContent="flex-start"
                alignItems="stretch"
                spacing={0}
                padding={2}
            >
                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreSharp />}>
                        Javascript
                    </AccordionSummary>
                    <AccordionDetails>
                        <FormControl fullWidth>
                            <InputLabel shrink htmlFor="select-subflow">
                                Subflow Name
                            </InputLabel>
                            <Select
                                labelId="select-subflow"
                                variant="outlined"
                                size="small"
                                value={nodeIdNamePairs.find((e) => e.id === state.workflowId)?.id || "None"}
                                onChange={(e) => {
                                    const selectedPair = nodeIdNamePairs.find(
                                        (cred) => cred.id === e.target.value
                                    );
                                    if (selectedPair) {
                                        dispatch({ type: "SET_WORKFLOW_ID", value: selectedPair.id });
                                    } else {
                                        dispatch({ type: "SET_WORKFLOW_ID", value: "" });
                                    }
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            zIndex: 1002,
                                        },
                                    },
                                }}
                            >
                                <MenuItem value="None">
                                    <em>None</em>
                                </MenuItem>
                                {nodeIdNamePairs.map((cred) => (
                                    <MenuItem key={cred.name} value={cred.id}>
                                        {cred.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </AccordionDetails>
                </Accordion>

                {Array.isArray(state.handoffs.items) && state.handoffs.items.length > 0 && (
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreSharp />}>
                            Handoffs
                        </AccordionSummary>
                        <AccordionDetails>
                            <HandoffsEditor
                                value={state.handoffs}
                                onChange={(value) => dispatch({ type: "SET_HEADOFFS", value })}
                            />
                        </AccordionDetails>
                    </Accordion>
                )}
            </Stack>
        </CommonDialog>
    );
}
