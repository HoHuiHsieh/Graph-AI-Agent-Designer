/**
 * @fileoverview This file defines the ReActAgentForm component, which provides a user interface for configuring ReActAgent nodes
 * in a ReactFlow graph. It includes state management, form controls, and integration with the application's context.
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
    FormControlLabel,
    Switch,
} from "@mui/material";
import { ExpandMoreSharp } from "@mui/icons-material";
import { BaseHandoffType, AgentNode, DATA_TYPES } from "../../../types/nodes";
import { usePanel } from "../../provider";
import CommonDialog from "./common/dialog";
import HandoffsEditor from "./common/HandoffsEditor";
import { updateHandoffs } from "./utils";


type State = AgentNode["data"];

type Action =
    | { type: "SET_NAME"; value: string }
    | { type: "SET_MEMORY"; value: boolean }
    | { type: "SET_QUERY"; value: string }
    | { type: "SET_SYSTEM_PROMPT"; value: string }
    // | { type: "SET_USER_PROMPT"; value: string }
    | { type: "SET_HEADOFFS"; value: BaseHandoffType }; // Replace `any` with a more specific type if available


const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "SET_NAME":
            return { ...state, name: action.value };
        case "SET_MEMORY":
            return { ...state, memory: action.value };
        case "SET_SYSTEM_PROMPT":
            return { ...state, systemPrompt: action.value };
        // case "SET_USER_PROMPT":
        //     return { ...state, userPrompt: action.value };
        case "SET_HEADOFFS":
            return { ...state, handoffs: action.value };
        default:
            return state;
    }
};

export const initialNodeData = {
    type: DATA_TYPES.REACT_AGENT,
    name: "ReActAgent",
    memory: false,
    systemPrompt: `You are an expert AI problem-solver.
Your task is to:
1. Carefully analyze the user's problem.
2. Break down the complex problem into clear, smaller steps.
3. Solve the problem step-by-step, thinking carefully at each stage.
4. For every step, **wrap your reasoning inside <think>...</think> tags**.
5. Proceed only after fully thinking through each step before moving to the next.
6. At the end, **wrap your final answer inside <answer>...</answer> tags**.

Follow this structure exactly.
`,
    userPrompt: "{{ $json.Chat.input }}",
    handoffs: {
        items: [],
        useAi: true,
        credName: "",
        model: "",
        prompt: "",
    },
};

/**
 * ReActAgentForm component for managing ReActAgent node data.
 * @returns 
 */
export default function ReActAgentForm(): React.ReactNode {
    // Context hooks for managing panel state and ReactFlow nodes
    const { setNodes, getEdges } = useReactFlow();
    const { openPanel, credentials } = usePanel();

    // Extract data from the open panel
    const data: State = openPanel?.data || undefined;
    if (!data) {
        console.error("No data available for the ReActAgent form");
        return null;
    }

    // Use reducer for managing state
    const [state, dispatch] = React.useReducer(reducer, {
        ...initialNodeData,
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
                        Agent Configuration
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack
                            direction="column"
                            justifyContent="flex-start"
                            alignItems="stretch"
                            spacing={2}
                        >
                            <TextField
                                label="System Prompt"
                                variant="outlined"
                                fullWidth
                                multiline
                                minRows={4}
                                size="small"
                                type="number"
                                value={state.systemPrompt}
                                onChange={(e) => {
                                    dispatch({ type: "SET_SYSTEM_PROMPT", value: e.target.value });
                                }}
                            />
                            {/* <TextField
                                label="User Prompt"
                                variant="outlined"
                                fullWidth
                                multiline
                                minRows={4}
                                size="small"
                                type="number"
                                value={state.userPrompt}
                                onChange={(e) => {
                                    dispatch({ type: "SET_USER_PROMPT", value: e.target.value });
                                }}
                            /> */}
                            <FormControlLabel
                                label="Memory"
                                control={
                                    <Switch
                                        checked={Boolean(state.memory)}
                                        onChange={(event) => {
                                            dispatch({ type: "SET_MEMORY", value: event.target.checked || false });
                                        }}
                                    />
                                }
                            />
                        </Stack>
                    </AccordionDetails>
                </Accordion>

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



