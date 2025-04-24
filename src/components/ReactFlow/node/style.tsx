/**
 * @fileoverview Defines the styles for various types of nodes used in the ReactFlow component.
 * Each node type has its own specific styling properties such as background, border, dimensions, and alignment.
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { FLOW_COLOR, MODEL_COLOR, TOOL_COLOR, TRANSPARENT } from "../constant";


export const nodeStyles: { [key: string]: React.CSSProperties } = {
    default: {
        background: "#FFF",
        border: "1px solid black",
        borderRadius: 10,
        fontSize: 16,
        padding: 8,
        width: 50,
        height: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    flowpoint: {
        background: "#FFF",
        border: "1px solid black",
        borderRadius: 25,
        fontSize: 16,
        padding: 8,
        width: 60,
        height: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    tool: {
        background: "#FFF",
        border: "1px solid black",
        borderRadius: 30,
        fontSize: 16,
        padding: 8,
        width: 50,
        height: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    model: {
        background: "#FFF",
        border: "1px solid black",
        borderRadius: 30,
        fontSize: 16,
        padding: 8,
        width: 50,
        height: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    agent: {
        background: "#FFF",
        border: "1px solid black",
        borderRadius: 10,
        fontSize: 16,
        padding: 8,
        width: 120,
        height: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
}


// Define reusable styles for handles and other elements
export const handleBaseStyle = {
    backgroundColor: TRANSPARENT,
    width: "10px",
    height: "10px",
    border: "3px solid",
    borderRadius: "2px",
};

export const targetHandleStyle = {
    ...handleBaseStyle,
    borderColor: FLOW_COLOR,
    left: "-5px",
    top: "50%",
};

export const sourceHandleStyle = {
    ...handleBaseStyle,
    borderColor: FLOW_COLOR,
    right: "-5px",
    top: "50%",
};

export const toolHandleStyle = {
    ...handleBaseStyle,
    borderColor: TOOL_COLOR,
    left: "50%",
    top: "-5px",
};

export const modelHandleStyle = {
    ...handleBaseStyle,
    borderColor: MODEL_COLOR,
    left: "50%",
    top: "-5px",
};

export const iconButtonStyle = {
    width: "50px",
    height: "50px",
};

export const labelStyle = {
    position: "absolute",
    left: "50%",
    bottom: "-20px",
    transform: "translate(-50%, 0)",
};