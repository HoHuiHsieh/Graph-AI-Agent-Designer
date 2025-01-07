/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { ReactFlowEdge, ReactFlowNode } from "../typedef";


/**
 * 
 * @param node 
 * @param nodes 
 * @param edges 
 * @returns 
 */
export function getIncomers(node: ReactFlowNode, nodes: ReactFlowNode[], edges: ReactFlowEdge[]): ReactFlowNode[] {
    // find all edges connected to the node targe
    const items = edges.filter(edge => edge.target === node.id);
    // get ids of source nodes.
    const ids = items.map(e => e.source);
    // return source nodes
    return nodes.filter(node => ids.includes(node.id));
}