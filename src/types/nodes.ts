/**
 * @fileoverview This file defines the types for the nodes and edges used in the LangGraph class.
 * 
 * @author @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { OpenAIModelPropsType } from "./api";

// Constants for repeated strings
export const NODE_TYPES = {
    FLOWPOINT: "flowpoint",
    AGENT: "agent",
    DEFAULT: "default",
    TOOL: "tool",
    MODEL: "model",
};

export const DATA_TYPES = {
    START: "start",
    CHAT: "chat",
    END: "end",
    REACT_AGENT: "react-agent",
    JAVASCRIPT: "javascript",
    HTTP: "http",
    POSTGRESQL: "postgresql",
    SUBFLOW: "subflow",
    OPENAI: "openai",
};

// Base node data types

export type BaseAIHandoffItemType = {
    name: string;
    description: string;
}
export type BaseAIHandoffType = {
    useAi: true;
    items: BaseAIHandoffItemType[];
    credName: string;
    model: string;
    prompt: string;
}
// export type BaseExpressHandoffItemType = {
//     name: string;
//     express: string;
// }
// export type BaseExpressHandoffType = {
//     useAi: true;
//     items: BaseExpressHandoffItemType[];
// }

export type BaseHandoffType = BaseAIHandoffType;

export type BaseNodeDataType<T = {}> = {
    type: string;
    name: string;
    handoffs: BaseHandoffType;
} & T;

export type ArgumentsType = {
    [key: string]: {
        type: string;
        description: string;
    }
}


// Model node types
export type OpenAiModelDataType = OpenAIModelPropsType & {
    type: string;
    name: string;
    credName: string;
}
export interface OpenAiModelType {
    type: "model";
    data: OpenAiModelDataType;
}


// Code node types
export type CodeNodeDataType = BaseNodeDataType<{
    code: string;
}>

export type CodeToolDataType = BaseNodeDataType<{
    description: string;
    arguments?: ArgumentsType;
} & CodeNodeDataType>

export interface CodeNodeType {
    type: "node";
    data: CodeNodeDataType;
}

export interface CodeToolType {
    type: "tool";
    data: CodeToolDataType;
}


// HTTP node data types
export const RESTMethods = ["GET", "POST", "PUT", "DELETE"];
export type RESTMethod = "GET" | "POST" | "PUT" | "DELETE";

export type HTTPNodeDataType = BaseNodeDataType<{
    url: string;
    method: RESTMethod;
    headers: Record<string, string>;
    body?: string;
    params?: Record<string, string>;
}>

export type HttpToolDataType = BaseNodeDataType<{
    description: string;
    arguments?: ArgumentsType;
} & HTTPNodeDataType>

export interface HTTPNodeType {
    type: "node";
    data: HTTPNodeDataType;
}

export interface HttpToolType {
    type: "tool";
    data: HttpToolDataType;
}


// PostgreSQL node types
export type PostgreSQLNodeDataType = BaseNodeDataType<{
    credName: string,
    query: string,
}>

export type PostgreSQLToolDataType = BaseNodeDataType<{
    description: string;
    arguments?: ArgumentsType;
} & PostgreSQLNodeDataType>

export interface PostgreSQLNodeType {
    type: "node";
    data: PostgreSQLNodeDataType;
}

export interface PostgreSQLToolType {
    type: "tool";
    data: PostgreSQLToolDataType;
}


// Subflow node types
export type SubflowNodeDataType = BaseNodeDataType<{
    workflowId: string;
}>

export interface SubflowNode {
    type: "node";
    data: SubflowNodeDataType;
}


// Agent node types
export interface AgentNode {
    type: "node";
    data: BaseNodeDataType<{
        model: OpenAiModelDataType;
        tools: (CodeToolDataType | HttpToolDataType | PostgreSQLToolDataType)[];
        memory: boolean;
        systemPrompt: string;
        // userPrompt: string;
    }>;
}


