/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */

import { ReactFlowNode } from "../../typedef";
import { StaticNodeAction } from "../typedef";


interface PlanNode extends ReactFlowNode {
    data: {
        prompt: string,
    }
}

interface PlanProps extends StaticNodeAction {
    node: PlanNode
}

/**
 * 
 * @param tool 
 * @param messages 
 * @param tools 
 * @param props 
 * @returns 
 */
export async function runPromptPlanner(plan: PlanProps, messages?: any, tools?: any, props?: any): Promise<string> {
    return plan.node.data.prompt
}