/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { convertNodeToAction } from "./Action";
import runWorkGroups from "./WorkGroup";
import { ReactFlowNode, ReactFlowEdge } from "./typedef";


export interface WorkFlowRequestProps {
    nodes: ReactFlowNode[],
    edges: ReactFlowEdge[],
}

export interface WorkFlowResponse extends WorkFlowRequestProps {
}

/**
 * 
 * @param props 
 * @returns 
 */
export default async function runWorkflow(props: WorkFlowRequestProps): Promise<WorkFlowResponse> {
    const { nodes, edges } = props;
    // convert nodes to actions
    const nodeActions = convertNodeToAction(nodes);
    // run pipelines
    const updatedActNodes = await runWorkGroups(nodeActions, nodes, edges);
    // return nodes
    const updatedNodes = updatedActNodes.flatMap(e => e.map(e => e.getNode()));
    return { edges, nodes: updatedNodes }
}