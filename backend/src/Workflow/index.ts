/**
 * @author HoHui Hsieh
 */
import { Edge, getIncomers, Node } from "reactflow";
import { Socket } from "socket.io";
import { actionTypes } from "./Nodes";
import { DynamicNodeAction, StaticNodeAction } from "./Nodes/base";


export interface Workflow {
    edges: Edge[],
    nodes: Node[],
}

/**
 * 
 * @param json_string 
 * @param ws 
 */
export default async function runWorkFlow(json_string: string, ws: Socket) {
    try {
        // check input
        let data: Workflow = JSON.parse(json_string);
        if (!Array.isArray(data?.nodes)) { throw new Error("Failed to parse Nodes.") }
        if (!Array.isArray(data?.edges)) { throw new Error("Failed to parse Edges.") }
        let t0 = performance.now();

        // initialize node action objects
        let nodes = data.nodes.map((node) => {
            let Action = actionTypes[node.type as keyof typeof actionTypes] || StaticNodeAction;
            let nodeAct = new Action(node);
            nodeAct.setPending();
            return nodeAct
        })

        // loop actions
        for (let index = 0; index < nodes.length; index++) {

            // run actions in parallel
            nodes = await Promise.all(nodes.map(node => {
                let sources_from_data = getIncomers(node.node, data.nodes, data.edges);
                let sources = sources_from_data.reduce((arr, n: Node) => {
                    let node = nodes.find(e => e.node.id === n.id);
                    if (node) { return [...arr, node] }
                    return arr
                }, [] as DynamicNodeAction[])
                return node.action(sources);

            })).catch((error) => {
                console.error(error);
                throw new Error(error)
            })

            // send result
            let result: Workflow = { nodes: nodes.map(e => e.getNode()), edges: data.edges }
            ws.send(JSON.stringify({
                data: result,
                progress: Math.ceil(100 * (index + 1) / data.nodes.length),
                elapsed_time: performance.now() - t0,
            }));
        }

        // check result
        if (nodes.some(e => !e.checkCompleted())) {
            throw new Error("工作無法完成，請檢查工作元件！")
        }

        // send result
        ws.send(JSON.stringify({
            data: { nodes: nodes.map(e => e.getNode()), edges: data.edges },
            progress: "completed",
            elapsed_time: performance.now() - t0,
        }));

    } catch (error: any) {
        console.error(error);
        error = error.message || JSON.stringify(error);
        ws.send(JSON.stringify({ error }));
    }
}
