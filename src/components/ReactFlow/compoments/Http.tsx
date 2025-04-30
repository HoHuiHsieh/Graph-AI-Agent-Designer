/**
 * @fileoverview This file contains the implementation of the HttpForm component, which provides a user interface for configuring HTTP requests.
 * It includes support for setting HTTP headers, body, query parameters, and other request details.
 * The component uses React's useReducer for state management and integrates with ReactFlow for node updates.
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
import { ArgumentsType, BaseHandoffType, HttpToolDataType, HTTPNodeDataType, RESTMethod, RESTMethods } from "../../../types/nodes";
import { usePanel } from "../../provider";
import CommonDialog from "./common/dialog";
import ToolUse from "./common/ToolUse";
import HandoffsEditor from "./common/HandoffsEditor";
import { getInlineArgumentsFromString, updateHandoffs } from "./utils";
import { DATA_TYPES } from "../../../types/nodes";
import JsonEditor from "./common/JsonEditor";


type State = HttpToolDataType & HTTPNodeDataType;

type Action =
    | { type: "SET_NAME"; value: string }
    | { type: "SET_URL"; value: string }
    | { type: "SET_METHOD"; value: RESTMethod }
    | { type: "SET_HEADERS"; value: Record<string, string> }
    | { type: "SET_BODY"; value: string | undefined }
    | { type: "SET_PARAMS"; value: Record<string, string> }
    | { type: "SET_ARGUMENTS"; value: ArgumentsType }
    | { type: "SET_DESCRIPTION"; value: string }
    | { type: "SET_HEADOFFS"; value: BaseHandoffType }; // Replace `any` with a more specific type if available


const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "SET_NAME":
            return { ...state, name: action.value };
        case "SET_URL":
            return { ...state, url: action.value };
        case "SET_METHOD":
            return { ...state, method: action.value };
        case "SET_HEADERS":
            return { ...state, headers: action.value };
        case "SET_BODY":
            return { ...state, body: action.value };
        case "SET_PARAMS":
            return { ...state, params: action.value };
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

export const initialNodeData: HTTPNodeDataType = {
    type: DATA_TYPES.HTTP,
    name: "Http",
    url: "",
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
    body: "",
    params: {},
    handoffs: {
        items: [],
        useAi: true,
        credName: "",
        model: "",
        prompt: "",
    },
};

export const initialToolData: HttpToolDataType = {
    ...initialNodeData,
    description: "",
    arguments: {},
};

/**
 * HttpForm component
 * @returns 
 */
export default function HttpForm(): React.ReactNode {
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
    const initialData = openPanel?.type === "tool" ? initialToolData : initialNodeData;
    const [state, dispatch] = React.useReducer(reducer, {
        ...initialData,
        ...data,
        handoffs: {
            ...initialData.handoffs,
            ...(data?.handoffs || {})
        }
    });

    // Update node data when the component unmounts
    React.useEffect(() => {
        return () => {
            setNodes((nodes) =>
                nodes.map((node) => {
                    if (node.id === openPanel?.id) {
                        // Update node properties
                        const getArgs = (objs: any) => Object.keys(objs).reduce((args: any, key: string) => ({
                            ...args,
                            ...getInlineArgumentsFromString(objs[key]),
                        }), {});
                        Object.assign(node.data, {
                            ...state,
                            body: state.method === "GET" ? "" : state.body,
                            params: state.method === "GET" ? state.params : {},
                            arguments: node.type === "tool" ? {
                                ...getInlineArgumentsFromString(state.url || ""),
                                ...getInlineArgumentsFromString(state.body || ""),
                                ...getArgs(state.headers || {}),
                                ...getArgs(state.params || {}),
                            } : {},
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
    }, [openPanel.id, state, setNodes, getEdges]);

    return (
        <CommonDialog
            title={
                <TextField
                    label="Node Name"
                    variant="outlined"
                    size="small"
                    value={state.name}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value && /^[A-Za-z0-9_]*$/.test(value)) {
                            dispatch({ type: "SET_NAME", value });
                        }
                    }}
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
                        Http
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack
                            direction="column"
                            justifyContent="flex-start"
                            alignItems="stretch"
                            spacing={2}
                        >
                            <Stack
                                direction="row"
                                spacing={1}
                                justifyContent="flex-start"
                                alignItems="center"
                            >

                                <FormControl fullWidth >
                                    <InputLabel shrink htmlFor="select-http-method">
                                        Method
                                    </InputLabel>
                                    <Select
                                        labelId="select-http-method"
                                        variant="outlined"
                                        size="small"
                                        value={state.method}
                                        onChange={(e) => dispatch({ type: "SET_METHOD", value: e.target.value as RESTMethod })}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    zIndex: 1002,
                                                },
                                            },
                                        }}
                                    >
                                        {RESTMethods.map((m) => (
                                            <MenuItem key={m} value={m}>
                                                {m}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    label="URL"
                                    size="small"
                                    value={state.url}
                                    onChange={(e) => dispatch({ type: "SET_URL", value: e.target.value })}
                                />
                            </Stack>

                            <JsonEditor
                                label="Headers"
                                value={state.headers}
                                onChange={(value) => dispatch({ type: "SET_HEADERS", value })}
                            />

                            {state.method !== "GET" && (
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    label="Body"
                                    size="small"
                                    multiline
                                    value={state.body}
                                    onChange={(e) => dispatch({ type: "SET_BODY", value: e.target.value })}
                                />
                            )}

                            {state.method == "GET" && (
                                <JsonEditor
                                    label="Params"
                                    value={state.params}
                                    onChange={(value) => dispatch({ type: "SET_PARAMS", value })}
                                />
                            )}
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
            </ Stack>
        </CommonDialog>
    )
}