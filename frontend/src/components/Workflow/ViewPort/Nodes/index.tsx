/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { NodeTypes } from "reactflow";
import EntryPointNode, { getDefaultEntryPointNode, EntryPointIcon, EntryPointLabel } from "./EntryPoint";
import AgentNode, { getDefaultAgentNode, AgentIcon, AgentLabel } from "./Agent";
import GuardrailNode, { getDefaultGuardrailNode, GuardrailIcon, GuardrailLabel } from "./Guardrail";
import CheckFactNode, { getDefaultCheckFactNode, CheckFactIcon, CheckFactLabel } from "./CheckFact";

import PromptPlanNode, { getDefaultPromptPlanNode, PromptPlanIcon, PromptPlanLabel } from "./Plan/Prompt";
import LLMPlanNode, { getDefaultLLMPlanNode, LLMPlanIcon, LLMPlanLabel } from "./Plan/LLM";

import PythonToolNode, { getDefaultPythonToolNode, PythonToolIcon, PythonToolLabel } from "./Tool/Python";
import PromptToolNode, { getDefaultPromptToolNode, PromptToolIcon, PromptToolLabel } from "./Tool/Prompt";
import PDFToolNode, { getDefaultPDFToolNode, PDFToolIcon, PDFToolLabel } from "./Tool/PDF";

import ChatRoomNode, { getDefaultChatRoomNode, ChatRoomIcon, ChatRoomLabel } from "./EndPoint/ChatRoom"


export const nodeTypes: NodeTypes = {
    "EntryPoint": EntryPointNode,
    "Agent": AgentNode,
    "Guardrail": GuardrailNode,
    "CheckFact": CheckFactNode,

    "PromptPlan": PromptPlanNode,
    "LLMPlan": LLMPlanNode,

    "PythonTool": PythonToolNode,
    "PromptTool": PromptToolNode,
    "PDFTool": PDFToolNode,

    "ChatRoom": ChatRoomNode,
}

export const defaultData = {
    "EntryPoint": getDefaultEntryPointNode,
    "Agent": getDefaultAgentNode,
    "Guardrail": getDefaultGuardrailNode,
    "CheckFact": getDefaultCheckFactNode,

    "PromptPlan": getDefaultPromptPlanNode,
    "LLMPlan": getDefaultLLMPlanNode,

    "PythonTool": getDefaultPythonToolNode,
    "PromptTool": getDefaultPromptToolNode,
    "PDFTool": getDefaultPDFToolNode,

    "ChatRoom": getDefaultChatRoomNode,
}

export const nodeItems = [
    { key: "EntryPoint", label: EntryPointLabel, icon: EntryPointIcon, group: "Workflow", disabled: false },
    { key: "Agent", label: AgentLabel, icon: AgentIcon, group: "Workflow", disabled: false },
    { key: "Guardrail", label: GuardrailLabel, icon: GuardrailIcon, group: "Workflow", disabled: false },
    { key: "CheckFact", label: CheckFactLabel, icon: CheckFactIcon, group: "Workflow", disabled: false },
    { key: "ChatRoom", label: ChatRoomLabel, icon: ChatRoomIcon, group: "Workflow", disabled: false },
    {},
    { key: "PromptPlan", label: PromptPlanLabel, icon: PromptPlanIcon, group: "Plan", disabled: false },
    { key: "LLMPlan", label: LLMPlanLabel, icon: LLMPlanIcon, group: "Plan", disabled: false },
    {},
    { key: "PythonTool", label: PythonToolLabel, icon: PythonToolIcon, group: "Tool", disabled: false },
    { key: "PromptTool", label: PromptToolLabel, icon: PromptToolIcon, group: "Tool", disabled: false },
    { key: "PDFTool", label: PDFToolLabel, icon: PDFToolIcon, group: "Tool", disabled: false },
]