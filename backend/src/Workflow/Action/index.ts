/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import AgentAction from "./Agent";
import GuardrailAction from "./Guardrail";
import CheckFactAction from "./CheckFact";
import ChatRoomAction from "./ChatRoom";
import { StaticNodeAction, ActionNodes } from "./typedef";
import { ReactFlowNode } from "../typedef";


const actionTypes = {
    Agent: AgentAction,
    Guardrail: GuardrailAction,
    CheckFact: CheckFactAction,
    ChatRoom: ChatRoomAction,
}

/**
 * 
 * @param nodes 
 * @returns 
 */
export function convertNodeToAction(nodes: ReactFlowNode[]): ActionNodes {
    return nodes.map((node) => {
        const Action = actionTypes[node.type as keyof typeof actionTypes] || StaticNodeAction;
        return new Action(node)
    })
}