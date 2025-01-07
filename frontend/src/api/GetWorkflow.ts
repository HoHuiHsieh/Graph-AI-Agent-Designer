/**
 * add GetWorkflow class with run method
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { Edge, Node } from "reactflow";
import { instance } from "./base";


interface WorkflowData {
    nodes: Node[],
    edges: Edge[]
}

/**
 * 
 * @param nodes 
 * @param edges 
 * @returns 
 */
export async function runWorkflow(nodes: Node[], edges: Edge[]): Promise<WorkflowData> {
    let { data } = await instance.post("/workflow", { nodes, edges });
    return data;
}