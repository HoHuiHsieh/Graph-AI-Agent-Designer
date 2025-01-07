/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { ReactFlowNode, ReactFlowEdge } from "../typedef";
import { ActionNodes } from "../Action/typedef";
import ChatRoomGroup from "./ChatRoom";


const groupTypes = [
    ChatRoomGroup,
];

/**
 * 
 * @param actNodes 
 * @param node 
 * @param edge 
 * @returns 
 */
export default function runWorkGroups(actNodes: ActionNodes, node: ReactFlowNode[], edge: ReactFlowEdge[]): Promise<ActionNodes[]> {
    // grouping nodes
    const grouped = actNodes.reduce((acc, current) => {
        const key = current.node.parentId || "main";
        if (!acc[key]) { acc[key] = []; }
        acc[key].push(current);
        return acc
    }, {} as { [key: string]: ActionNodes });

    return Promise.all(Object.keys(grouped).map((key) => {
        let groupedNodes = grouped[key];
        let job = groupTypes.map((e) => e.checkNodes(groupedNodes)).find(e => e);
        if (job) {
            return job.runPipeline(node, edge);
        }
        return []
    }))
}