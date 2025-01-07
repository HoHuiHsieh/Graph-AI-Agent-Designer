/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { ToolUseResponse } from "../../../Models/ChatCompletion";
import { retrieve } from "../../../RAGDoc";
import { StaticNodeAction } from "../typedef";
import { ReactFlowNode } from "../../typedef";


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
        checksum: string,
        filename: string,
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
export async function runPDFTool(command: ToolUseResponse, tool: ToolProps, props?: any): Promise<string[]> {
    // check prompt
    if (!tool.node.data.prompt.includes("{{ content }}")) {
        throw new Error("'{{ content }}' is required in PDFTool prompt.")
    }
    if (!tool.node.data.checksum) {
        throw new Error("PDF file not uploaded.")
    }
    // search in document
    const keyword = command?.arguments?.keyword;
    if (!keyword) { return [] }
    const checksum = tool.node.data?.checksum;
    const pdf_inst: string[] = await retrieve(checksum, keyword);
    // return result
    let result = tool.node.data.prompt;
    return pdf_inst.map(doc => result.replace("{{ content }}", doc));
}