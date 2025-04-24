/**
 * @fileoverview This module defines and exports edge types and styles for use with React Flow.
 * It includes a default edge type and associated styles.
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { EdgeTypes } from "reactflow";
import DefaultEdge from "./Default";
import ToolEdge from "./Tool";
import ModelEdge from "./Model";


export const edgeTypes: EdgeTypes = {
    default: DefaultEdge,
    flow: DefaultEdge,
    model: ModelEdge,
    tool: ToolEdge,
};
