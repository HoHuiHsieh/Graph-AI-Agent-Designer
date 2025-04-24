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
import { ArgumentsType, BaseHandoffType, CodeNodeDataType, CodeToolDataType } from "../../../types/nodes";
import { usePanel } from "../../provider";
import CommonDialog from "./common/dialog";
import ToolUse from "./common/ToolUse";
import HandoffsEditor from "./common/HandoffsEditor";
import { getInlineArgumentsFromString, updateHandoffs } from "./utils";
import { DATA_TYPES } from "../../../types/nodes";
import { CodeEditor } from "./common/CodeEditor";


type State = CodeNodeDataType & CodeToolDataType;

type Action =
    | { type: "SET_NAME"; value: string }
    | { type: "SET_CODE"; value: string }
    | { type: "SET_ARGUMENTS"; value: ArgumentsType }
    | { type: "SET_DESCRIPTION"; value: string }
    | { type: "SET_HEADOFFS"; value: BaseHandoffType }; // Replace `any` with a more specific type if available


const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "SET_NAME":
            return { ...state, name: action.value };
        case "SET_CODE":
            return { ...state, code: action.value };
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

export const initialNodeData: CodeNodeDataType = {
    type: DATA_TYPES.JAVASCRIPT,
    name: "JavaScript",
    code: "",
    handoffs: {
        items: [],
        useAi: false,
        credName: "",
        model: "",
    },
};

export const initialToolData: CodeToolDataType = {
    ...initialNodeData,
    description: "",
    arguments: {},
};

/**
 * JavascriptForm component
 * @returns 
 */
export default function JavascriptForm(): React.ReactNode {
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
        return () => {
            setNodes((nodes) =>
                nodes.map((node) => {
                    if (node.id === openPanel?.id) {
                        // Update node properties
                        Object.assign(node.data, {
                            ...state,
                            arguments: node.type === "tool"
                                ? {
                                    ...getInlineArgumentsFromString(state.code),
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
    }, [openPanel.id, state, setNodes, getEdges]);

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
                        <CodeEditor
                            height="50vh"
                            language="javascript"
                            theme="vs-dark"
                            defaultValue={state.code}
                            onChange={(value) => dispatch({ type: "SET_CODE", value: value })}
                        />
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