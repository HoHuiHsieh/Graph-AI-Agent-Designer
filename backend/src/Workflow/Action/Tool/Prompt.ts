/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { ReactFlowNode } from "Workflow/typedef";
import { ToolUseResponse } from "../../../Models/ChatCompletion";
import { StaticNodeAction } from "../typedef";


interface ToolNode extends ReactFlowNode {
    data: {
        name: string,
        description: string,
        prompt: string,
    }
}

interface ToolProps extends StaticNodeAction {
    node: ToolNode
}

/**
 * 
 * @param command 
 * @param tool 
 * @param props 
 * @returns 
 */
export async function runPromptTool(command: ToolUseResponse, tool: ToolProps, props?: any): Promise<string> {
    // return prompt
    return tool.node.data.prompt
}