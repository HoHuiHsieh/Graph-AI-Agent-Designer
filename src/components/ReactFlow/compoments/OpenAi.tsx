/**
 * @fileoverview 
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
} from "@mui/material";
import { ExpandMoreSharp } from "@mui/icons-material";
import { BaseHandoffType, OpenAiModelDataType } from "../../../types/nodes";
import { usePanel } from "../../provider";
import CommonDialog from "./common/dialog";
import { DATA_TYPES } from "../../../types/nodes";
import { ModelEditor, initialValues } from "./common/ModelEditor";


type State = OpenAiModelDataType;


type Action =
    | { type: "SET_NAME"; value: string }
    | { type: "SET_CRED_NAME"; payload: string }
    | { type: "SET_MODEL"; payload: string }
    | { type: "SET_MAX_COMPLETION_TOKENS"; payload: number }
    | { type: "SET_FREQUENCY_PENALTY"; payload: number }
    | { type: "SET_PRESENCE_PENALTY"; payload: number }
    | { type: "SET_TOP_P"; payload: number }
    | { type: "SET_TEMPERATURE"; payload: number }
    | { type: "SET_STOP"; payload: string[] }
    | { type: "SET_HEADOFFS"; payload: BaseHandoffType }

// Reducer function to manage state
const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "SET_NAME":
            return { ...state, name: action.value };
        case "SET_CRED_NAME":
            return { ...state, credName: action.payload };
        case "SET_MODEL":
            return { ...state, model: action.payload };
        case "SET_MAX_COMPLETION_TOKENS":
            return { ...state, max_completion_tokens: action.payload };
        case "SET_FREQUENCY_PENALTY":
            return { ...state, frequency_penalty: action.payload };
        case "SET_PRESENCE_PENALTY":
            return { ...state, presence_penalty: action.payload };
        case "SET_TOP_P":
            return { ...state, top_p: action.payload };
        case "SET_TEMPERATURE":
            return { ...state, temperature: action.payload };
        case "SET_STOP":
            return { ...state, stop: action.payload };
        default:
            return state;
    }
}

export const initialModelData: OpenAiModelDataType = {
    ...initialValues,
    type: DATA_TYPES.OPENAI,
    name: "OpenAI",
};


/**
 * OpenAiForm component
 * @returns 
 */
export default function OpenAiForm(): React.ReactNode {
    // Context hooks for managing panel state and ReactFlow nodes
    const { setNodes, getEdges } = useReactFlow();
    const { openPanel } = usePanel();

    // Extract data from the open panel
    const data: State = openPanel?.data || undefined;
    if (!data) {
        console.error("No data available for the PostgreSQL form");
        return null;
    }

    // Use reducer for managing state
    const [state, dispatch] = React.useReducer(reducer, {
        ...initialModelData,
        ...data,
    });

    // Update node data when the component unmounts
    React.useEffect(() => {
        return () => {
            setNodes((nodes) =>
                nodes.map((node) => {
                    if (node.id === openPanel?.id) {
                        // Update node properties
                        Object.assign(node.data, {
                            ...state,
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
                        if (value && /^[A-Za-z0-9_()]*$/.test(value)) {
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
                        OpenAi
                    </AccordionSummary>
                    <AccordionDetails>
                        <ModelEditor
                            credName={state.credName}
                            setCredName={(credName) => {
                                dispatch({ type: "SET_CRED_NAME", payload: credName });
                            }}
                            model={state.model}
                            setModel={(model) => {
                                dispatch({ type: "SET_MODEL", payload: model, });
                            }}
                            temperature={state.temperature}
                            setTemperature={(temperature) => {
                                dispatch({ type: "SET_TEMPERATURE", payload: temperature });
                            }}
                            top_p={state.top_p}
                            setTopP={(top_p) => {
                                dispatch({ type: "SET_TOP_P", payload: top_p });
                            }}
                            max_completion_tokens={state.max_completion_tokens}
                            setMaxCompletionTokens={(tokens) => {
                                dispatch({ type: "SET_MAX_COMPLETION_TOKENS", payload: tokens });
                            }}
                            frequency_penalty={state.frequency_penalty}
                            setFrequencyPenalty={(penalty) => {
                                dispatch({ type: "SET_FREQUENCY_PENALTY", payload: penalty });
                            }}
                            presence_penalty={state.presence_penalty}
                            setPresencePenalty={(penalty) => {
                                dispatch({ type: "SET_PRESENCE_PENALTY", payload: penalty });
                            }}
                            stop={state.stop}
                            setStop={(stop) => {
                                dispatch({ type: "SET_STOP", payload: stop });
                            }}
                            simplify={false}
                        />
                    </AccordionDetails>
                </Accordion>
            </ Stack>
        </CommonDialog>
    )
}