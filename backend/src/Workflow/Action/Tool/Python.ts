/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { runPython } from "../../../Python";
import { ToolUseResponse } from "../../../Models/ChatCompletion";
import { StaticNodeAction } from "../typedef";
import { ReactFlowNode } from "Workflow/typedef";


interface ToolNode extends ReactFlowNode {
    data: {
        name: string,
        description: string,
        properties: {
            name: string,
            type: string,
            description: string,
            required: boolean,
        }[],
        code: string,
        result?: string,
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
export async function runPythonTool(command: ToolUseResponse, tool: ToolProps, props?: any): Promise<string> {
    // build python code
    const cmd_name = command.name,
        cmd_args = command.arguments,
        c_args = Object.keys(cmd_args).reduce((arg, key) => {
            if (key in cmd_args) {
                return { ...arg, [key]: cmd_args[key] }
            }
            return arg
        }, {});
    let code = JSON.parse(JSON.stringify(tool.node.data.code)),
        pythonCmd = `${cmd_name}(**${JSON.stringify(c_args)})`;
    code += `\n\nprint(${pythonCmd})`
    // run code in python
    const result = await runPython({ env: "default", code });
    // return result
    tool.node.data = { ...tool.node.data, result };
    return result
}