/**
 * @fileoverview 
 * 
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React from "react";
import { ChatBubble, Http, SmartToy, SportsScore, Start } from "@mui/icons-material";
import DefaultForm from "./Default";
import PostgreSQLForm, { initialNodeData as PostgreSQLInitialNodeData, initialToolData as PostgreSQLInitialToolData } from "./PostgreSQL";
import JavascriptForm, { initialNodeData as JavascriptInitialNodeData, initialToolData as JavascriptInitialToolData } from "./JavaScript";
import HttpForm, { initialNodeData as HttpInitialNodeData, initialToolData as HttpInitialToolData } from "./Http";
import OpenAiForm, { initialModelData as OpenAiInitialModelData } from "./OpenAi";
import SubflowForm, { initialNodeData as SubflowInitialNodeData } from "./Subflow";
import ReActAgentForm, { initialNodeData as ReActAgentInitialNodeData } from "./ReActAgent";
import { nodeStyles } from "../node/style";
import { DATA_TYPES, NODE_TYPES } from "../../../types/nodes";


export interface ItemType {
    title: string;
    subtitle: string;
    items: {
        label: string;
        type: string;
        icon: React.ReactNode;
        form: React.ReactNode;
        data: any
        style: React.CSSProperties;
    }[];
}

export const itemList: ItemType[] = [
    {
        title: "Flow Control",
        subtitle: "Start, End, and Chat Control Nodes",
        items: [
            {
                label: "Chat",
                type: NODE_TYPES.FLOWPOINT,
                icon: <ChatBubble color="primary" />,
                form: <DefaultForm />,
                data: {
                    type: DATA_TYPES.CHAT,
                    name: "Chat",
                },
                style: nodeStyles.flowpoint,
            },
            {
                label: "__START__",
                type: NODE_TYPES.FLOWPOINT,
                icon: <Start color="primary" />,
                form: <DefaultForm />,
                data: {
                    type: DATA_TYPES.START,
                    name: "__START__",
                },
                style: nodeStyles.flowpoint,
            },
            {
                label: "__END__",
                type: NODE_TYPES.FLOWPOINT,
                icon: <SportsScore color="primary" />,
                form: <DefaultForm />,
                data: {
                    type: DATA_TYPES.END,
                    name: "__END__",
                },
                style: nodeStyles.flowpoint,
            },
        ]
    },
    {
        title: "Nodes",
        subtitle: "AI and App Applications",
        items: [
            {
                label: "ReAct Agent",
                type: NODE_TYPES.AGENT,
                icon: <SmartToy color="primary" />,
                form: <ReActAgentForm />,
                data: ReActAgentInitialNodeData,
                style: nodeStyles.agent,
            },
            {
                label: "HTTP",
                type: NODE_TYPES.DEFAULT,
                icon: <Http color="primary" />,
                form: <HttpForm />,
                data: HttpInitialNodeData,
                style: nodeStyles.default,
            },
            {
                label: "PostgreSQL",
                type: NODE_TYPES.DEFAULT,
                icon: <img src="/icons8-postgresql-96.png" alt="PostgreSQL" style={{ width: 24, height: 24 }} />,
                form: <PostgreSQLForm />,
                data: PostgreSQLInitialNodeData,
                style: nodeStyles.default,
            },
            {
                label: "Javascript",
                type: NODE_TYPES.DEFAULT,
                icon: <img src="/icons8-javascript-96.png" alt="JavaScript" style={{ width: 24, height: 24 }} />,
                form: <JavascriptForm />,
                data: JavascriptInitialNodeData,
                style: nodeStyles.default,
            },
            {
                label: "Multi-Agent",
                type: NODE_TYPES.DEFAULT,
                icon: <img src="/icons8-workflow-80.png" alt="Subflow" style={{ width: 24, height: 24 }} />,
                form: <SubflowForm />,
                data: SubflowInitialNodeData,
                style: nodeStyles.default,
            }
        ]
    },
    {
        title: "CSP",
        subtitle: "AI Cloud Service Provider",
        items: [
            {
                label: "OpenAI",
                type: NODE_TYPES.MODEL,
                icon: <img src="/icons8-chatgpt-100.png" alt="OpenAI" style={{ width: 24, height: 24 }} />,
                form: <OpenAiForm />,
                data: OpenAiInitialModelData,
                style: nodeStyles.model,
            },
        ]
    },
    {
        title: "Agent Tools",
        subtitle: "Tools for AI Agent",
        items: [
            {
                label: "HTTP",
                type: NODE_TYPES.TOOL,
                icon: <Http color="primary" />,
                form: <HttpForm />,
                data: HttpInitialToolData,
                style: nodeStyles.tool,
            },
            {
                label: "PostgreSQL",
                type: NODE_TYPES.TOOL,
                icon: <img src="/icons8-postgresql-96.png" alt="PostgreSQL" style={{ width: 24, height: 24 }} />,
                form: <PostgreSQLForm />,
                data: PostgreSQLInitialToolData,
                style: nodeStyles.tool,
            },
            {
                label: "Javascript",
                type: NODE_TYPES.TOOL,
                icon: <img src="/icons8-javascript-96.png" alt="JavaScript" style={{ width: 24, height: 24 }} />,
                form: <JavascriptForm />,
                data: JavascriptInitialToolData,
                style: nodeStyles.tool,
            }
        ]
    }
]


/**
 * This function retrieves an item from the itemList based on its type and data type.
 * @param type 
 * @param dataType 
 * @returns 
 */
export const getItem = (type: string, dataType: string) => {
    return itemList
        .flatMap((category) => category.items)
        .find((item) => item.type === type && item.data.type === dataType) || null;
};