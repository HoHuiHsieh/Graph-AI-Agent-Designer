/**
 * @fileoverview This file defines the types for the nodes and edges used in the LangGraph class.
 * 
 * @author @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { NodeProps } from "reactflow";
import { AgentNode, CodeToolDataType, HTTPNodeDataType, OpenAiModelDataType, BaseNodeDataType, PostgreSQLNodeDataType, SubflowNodeDataType } from "../../../types/nodes";


export interface DefaultNodePropsType extends NodeProps<BaseNodeDataType<{}>>{};

export interface AgentNodePropsType extends NodeProps<AgentNode["data"]>{};

export interface ModelNodePropsType extends NodeProps<OpenAiModelDataType> {};

export interface HTTPNodePropsType extends NodeProps<HTTPNodeDataType> {};

export interface PostgreSQLNodeTypePropsType extends NodeProps<PostgreSQLNodeDataType> {};

export interface CodeNodeTypePropsType extends NodeProps<CodeToolDataType> {};

export interface SubflowNodePropsType extends NodeProps<SubflowNodeDataType> {};

export type ReactFlowNodePropsType =
    | DefaultNodePropsType
    | AgentNodePropsType
    | ModelNodePropsType
    | HTTPNodePropsType
    | PostgreSQLNodeTypePropsType
    | CodeNodeTypePropsType
    | SubflowNodePropsType;
