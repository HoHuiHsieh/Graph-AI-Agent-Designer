/**
 * @fileoverview This file contains the styles for edges in the ReactFlow component.
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */

import { FLOW_COLOR, TOOL_COLOR, MODEL_COLOR } from "../constant";

const baseEdgeStyle = {
    strokeWidth: 1,
};

export const defaultEdgeStyle = {
    ...baseEdgeStyle,
    stroke: FLOW_COLOR,
};

export const toolEdgeStyle = {
    ...baseEdgeStyle,
    stroke: TOOL_COLOR,
};

export const modelEdgeStyle = {
    ...baseEdgeStyle,
    stroke: MODEL_COLOR,
};
