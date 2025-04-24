/**
 * @fileoverview This file defines the PostgreSQLForm component, which provides a user interface for configuring PostgreSQL nodes
 * in a ReactFlow graph. It includes state management, form controls, and integration with the application's context.
 * 
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */

import React from "react";
import { useReactFlow } from "reactflow";
import {
    MenuItem, Select, Stack, TextField,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    InputLabel,
    FormControl,
} from "@mui/material";
import { ExpandMoreSharp } from "@mui/icons-material";
import { ArgumentsType, BaseHandoffType, PostgreSQLNodeDataType, PostgreSQLToolDataType, DATA_TYPES } from "../../../types/nodes";
import { usePanel } from "../../provider";
import CommonDialog from "./common/dialog";
import ToolUse from "./common/ToolUse";
import HandoffsEditor from "./common/HandoffsEditor";
import { getInlineArgumentsFromString, updateHandoffs } from "./utils";
import { CodeEditor } from "./common/CodeEditor";


type State = PostgreSQLNodeDataType & PostgreSQLToolDataType;

type Action =
    | { type: "SET_NAME"; value: string }
    | { type: "SET_CRED"; value: string }
    | { type: "SET_QUERY"; value: string }
    | { type: "SET_ARGUMENTS"; value: ArgumentsType }
    | { type: "SET_DESCRIPTION"; value: string }
    | { type: "SET_HEADOFFS"; value: BaseHandoffType }; // Replace `any` with a more specific type if available


const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "SET_NAME":
            return { ...state, name: action.value };
        case "SET_CRED":
            return { ...state, credName: action.value };
        case "SET_QUERY":
            return { ...state, query: action.value };
        case "SET_ARGUMENTS":
            return { ...state, arguments: action.value };
        case "SET_DESCRIPTION":
            return { ...state, description: action.value };
        case "SET_HEADOFFS":
            return { ...state, handoffs: action.value };
        default:
            return state;
    }
};

export const initialNodeData = {
    type: DATA_TYPES.POSTGRESQL,
    name: "PostgreSQL",
    credName: "",
    query: "",
    handoffs: {
        items: [],
        useAi: false,
        credName: "",
        model: "",
    },
};

export const initialToolData = {
    ...initialNodeData,
    description: "",
    arguments: {},
};

/**
 * PostgreSQLForm component for managing PostgreSQL node data.
 * @returns 
 */
export default function PostgreSQLForm(): React.ReactNode {
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
        ...openPanel?.type === "tool" ? initialToolData : initialNodeData,
        ...data,
    });

    // Update node data when the component unmounts
    React.useEffect(() => {
        if (!openPanel) return;
        // Update the node data in the ReactFlow instance
        return () => {
            setNodes((nodes) =>
                nodes.map((node) => {
                    if (node.id === openPanel?.id) {
                        // Update node properties
                        Object.assign(node.data, {
                            ...state,
                            arguments: node.type === "tool"
                                ? {
                                    ...getInlineArgumentsFromString(state.query),
                                }
                                : undefined,
                            handoffs: {
                                ...state.handoffs,
                                items: Array.isArray(state?.handoffs?.items) ? updateHandoffs(node, nodes, getEdges(), state.handoffs.items) : [],
                            },
                        });
                    }
                    return node;
                })
            );
        };
    }, [state, openPanel, setNodes, getEdges]);

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
                        PostgreSQL Configuration
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack
                            direction="column"
                            justifyContent="flex-start"
                            alignItems="stretch"
                            spacing={2}
                        >

                            <FormControl fullWidth >
                                <InputLabel shrink htmlFor="select-postgresql-credential">
                                    Credential
                                </InputLabel>
                                <Select
                                    labelId="select-postgresql-credential"
                                    variant="outlined"
                                    size="small"
                                    value={state.credName || "None"}
                                    onChange={(e) => {
                                        const selectedCredential = credentials.postgresql.find(
                                            (cred) => cred.credName === e.target.value
                                        );
                                        if (selectedCredential) {
                                            dispatch({ type: "SET_CRED", value: selectedCredential.credName });
                                        } else {
                                            dispatch({ type: "SET_CRED", value: "" });
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
                                    {credentials.postgresql.map((cred) => (
                                        <MenuItem key={cred.credName} value={cred.credName}>
                                            {cred.credName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <CodeEditor
                                height="30vh"
                                defaultLanguage="sql"
                                theme="vs-dark"
                                defaultValue={state.query}
                                onChange={(value) => dispatch({ type: "SET_QUERY", value: value })}
                            />

                        </Stack>
                    </AccordionDetails>
                </Accordion>

                {openPanel?.type === "tool" &&
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreSharp />}>
                            Tool Use
                        </AccordionSummary>
                        <AccordionDetails>
                            <ToolUse
                                name={state.name}
                                description={state?.description}
                                arguments={state?.arguments}
                                onChange={(value) => dispatch({ type: "SET_DESCRIPTION", value })}
                            />
                        </AccordionDetails>
                    </Accordion>
                }

                {Array.isArray(state.handoffs.items) && state.handoffs.items.length > 0 &&
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
                }
            </Stack>
        </CommonDialog>
    )
}



