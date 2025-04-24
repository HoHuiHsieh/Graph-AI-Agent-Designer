/**
 * @fileoverview This file defines and exports the node types for ReactFlow nodes.
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { NodeTypes } from "reactflow";
import DefaultNode from "./Default";
import FlowPointNode from "./FlowPoint";
import ModelNode from "./Model";
import ToolNode from "./Tool";
import AgentNode from "./Agent";


export const nodeTypes: NodeTypes = {
    default: DefaultNode,
    node: DefaultNode,
    agent: AgentNode,
    model: ModelNode,
    tool: ToolNode,
    flowpoint: FlowPointNode,
}