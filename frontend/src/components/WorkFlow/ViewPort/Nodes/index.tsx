/**
 * collect node components
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useState, useCallback } from "react";
import { Box, styled } from "@mui/material";
import { Node, Edge, NodeTypes, OnSelectionChangeFunc, useOnSelectionChange } from "reactflow";
import { v4 } from "uuid";
import NodeTable from "./BaseNode/NodeTable";
import EntryPoint from "./EntryPoint";
import ChatRoom from "./ChatRoom";
import ChatRoomAPI from "./ChatRoomAPI";
import LLMChatCompletion from "./LLMChatCompletion";
import LLMFunctionCall from "./LLMFunctionCall";
import LLMSummarize from "./LLMSummarize";
import LLMCheckInput from "./LLMCheckInput";
import LLMCheckFact from "./LLMCheckFact";
import LLMCheckOutput from "./LLMCheckOutput";
import TextfieldSyst from "./TextfieldSyst";
import TextfieldInst from "./TextfieldInst";
import TextFileSyst from "./TextFileSyst";
import TextFileInst from "./TextFileInst";
import PythonCallInst from "./PythonCallInst";
import PythonCallSyst from "./PythonCallSyst";
import PythonRunInst from "./PythonRunInst";
import PythonRunSyst from "./PythonRunSyst";
import RAGSimpleInst from "./RAGSimpleInst";
import RAGSimpleSyst from "./RAGSimpleSyst";
import RAGSimpleFunc from "./RAGSimpleFunc";
import RAGCheckInput from "./RAGCheckInput";
import RAGCheckOutput from "./RAGCheckOutput";
import MemoryInst from "./MemoryInst";
import MemorySyst from "./MemorySyst";

// node components
export const nodeTypes: NodeTypes = {
    EntryPoint: EntryPoint.node,
    ChatRoom: ChatRoom.node,
    ChatRoomAPI: ChatRoomAPI.node,

    LLMChatCompletion: LLMChatCompletion.node,
    LLMFunctionCall: LLMFunctionCall.node,
    LLMSummarize: LLMSummarize.node,
    LLMCheckInput: LLMCheckInput.node,
    LLMCheckOutput: LLMCheckOutput.node,
    LLMCheckFact: LLMCheckFact.node,

    RAGSimpleInst: RAGSimpleInst.node,
    RAGSimpleSyst: RAGSimpleSyst.node,
    RAGSimpleFunc: RAGSimpleFunc.node,
    RAGCheckInput: RAGCheckInput.node,
    RAGCheckOutput: RAGCheckOutput.node,

    TextfieldSyst: TextfieldSyst.node,
    TextfieldInst: TextfieldInst.node,
    TextFileSyst: TextFileSyst.node,
    TextFileInst: TextFileInst.node,

    PythonCallSyst: PythonCallSyst.node,
    PythonCallInst: PythonCallInst.node,
    PythonRunSyst: PythonRunSyst.node,
    PythonRunInst: PythonRunInst.node,

    MemoryInst: MemoryInst.node,
    MemorySyst: MemorySyst.node,
}

// Draggable items in toolbox
export const draggableTypes = [
    { key: "EntryPoint", children: EntryPoint.draggable, group: "ChatRoom" },
    { key: "ChatRoom", children: ChatRoom.draggable, group: "ChatRoom" },
    { key: "ChatRoomAPI", children: ChatRoomAPI.draggable, group: "ChatRoom" },

    { key: "TextfieldSyst", children: TextfieldSyst.draggable, group: "Prompt" },
    { key: "TextfieldInst", children: TextfieldInst.draggable, group: "Prompt" },
    { key: "TextFileSyst", children: TextFileSyst.draggable, group: "Prompt" },
    { key: "TextFileInst", children: TextFileInst.draggable, group: "Prompt" },
    { key: "PythonRunSyst", children: PythonRunSyst.draggable, group: "Prompt" },
    { key: "PythonRunInst", children: PythonRunInst.draggable, group: "Prompt" },

    { key: "LLMChatCompletion", children: LLMChatCompletion.draggable, group: "Large Language Model (LLM)" },
    { key: "LLMFunctionCall", children: LLMFunctionCall.draggable, group: "Large Language Model (LLM)" },
    { key: "LLMSummarize", children: LLMSummarize.draggable, group: "Large Language Model (LLM)" },
    { key: "LLMCheckInput", children: LLMCheckInput.draggable, group: "Large Language Model (LLM)" },
    { key: "LLMCheckOutput", children: LLMCheckOutput.draggable, group: "Large Language Model (LLM)" },
    { key: "LLMCheckFact", children: LLMCheckFact.draggable, group: "Large Language Model (LLM)" },

    { key: "RAGSimpleInst", children: RAGSimpleInst.draggable, group: "Retrieval Augmented Generation (RAG)" },
    { key: "RAGSimpleSyst", children: RAGSimpleSyst.draggable, group: "Retrieval Augmented Generation (RAG)" },
    { key: "RAGSimpleFunc", children: RAGSimpleFunc.draggable, group: "Retrieval Augmented Generation (RAG)" },
    { key: "RAGCheckInput", children: RAGCheckInput.draggable, group: "Retrieval Augmented Generation (RAG)" },
    { key: "RAGCheckOutput", children: RAGCheckOutput.draggable, group: "Retrieval Augmented Generation (RAG)" },

    { key: "LLMCheckInput", children: LLMCheckInput.draggable, group: "Guardrails" },
    { key: "LLMCheckOutput", children: LLMCheckOutput.draggable, group: "Guardrails" },
    { key: "LLMCheckFact", children: LLMCheckFact.draggable, group: "Guardrails" },
    { key: "RAGCheckInput", children: RAGCheckInput.draggable, group: "Guardrails" },
    { key: "RAGCheckOutput", children: RAGCheckOutput.draggable, group: "Guardrails" },

    { key: "PythonCallSyst", children: PythonCallSyst.draggable, group: "Python Coding" },
    { key: "PythonCallInst", children: PythonCallInst.draggable, group: "Python Coding" },
    { key: "PythonRunSyst", children: PythonRunSyst.draggable, group: "Python Coding" },
    { key: "PythonRunInst", children: PythonRunInst.draggable, group: "Python Coding" },

    { key: "MemoryInst", children: MemoryInst.draggable, group: "Short Memory" },
    { key: "MemorySyst", children: MemorySyst.draggable, group: "Short Memory" },
]

// Input forms for node components
const formTypes = {
    default: NodeTable,
    ChatRoom: ChatRoom.form,
    ChatRoomAPI: ChatRoomAPI.form,

    LLMChatCompletion: LLMChatCompletion.form,
    LLMFunctionCall: LLMFunctionCall.form,
    LLMSummarize: LLMSummarize.form,
    LLMCheckInput: LLMCheckInput.form,
    LLMCheckOutput: LLMCheckOutput.form,
    LLMCheckFact: LLMCheckFact.form,

    RAGSimpleInst: RAGSimpleInst.form,
    RAGSimpleSyst: RAGSimpleSyst.form,
    RAGSimpleFunc: RAGSimpleFunc.form,
    RAGCheckInput: RAGCheckInput.form,
    RAGCheckOutput: RAGCheckOutput.form,

    TextfieldSyst: TextfieldSyst.form,
    TextfieldInst: TextfieldInst.form,
    TextFileSyst: TextFileSyst.form,
    TextFileInst: TextFileInst.form,

    PythonCallSyst: PythonCallSyst.form,
    PythonCallInst: PythonCallInst.form,
    PythonRunSyst: PythonRunSyst.form,
    PythonRunInst: PythonRunInst.form,

    MemoryInst: MemoryInst.form,
    MemorySyst: MemorySyst.form,
}

// styled toolbox
const ToolBoxPanel = styled(Box)(({ theme }) => ({
    width: "100%",
    height: "100%",
    border: "1px solid",
    borderLeft: "4px solid",
    borderColor: theme.palette.secondary.main,
    backgroundColor: theme.palette.background.default
}))


/**
 * 
 * @param props
 * @returns 
 */
export function ToolBox(): React.ReactNode {

    // handle mouse selection
    const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);
    const [selectedEdges, setSelectedEdges] = useState<Edge[]>([]);
    const onSelectChange: OnSelectionChangeFunc = useCallback(
        ({ nodes, edges }) => {
            setSelectedNodes(nodes.map((node) => node));
            setSelectedEdges(edges.map((edge) => edge));
        },
        []
    );
    useOnSelectionChange({ onChange: onSelectChange });

    // switch selected node types
    const switchNode = () => {
        const selectedNode = selectedNodes[0];
        const nodeType = selectedNode?.type as keyof typeof formTypes;
        const NodeForm = formTypes[nodeType] || formTypes["default"];
        return (
            <NodeForm
                key={v4()}
                {...selectedNode}
            />
        )
    };

    return (
        <ToolBoxPanel>
            {switchNode()}
        </ToolBoxPanel>
    );
}
