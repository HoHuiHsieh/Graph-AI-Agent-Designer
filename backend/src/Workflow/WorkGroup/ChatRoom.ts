/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { ReactFlowEdge, ReactFlowNode } from "../typedef";
import { ActionNodes, StaticNodeAction } from "../Action/typedef";
import { ChatRoomMessage } from "../typedef";
import { getIncomers } from "./utils";


/** */
export default class ChatRoomGroup {

    /**
     * 
     * @param nodes 
     * @returns 
     */
    static checkNodes(nodes: ActionNodes) {
        try {
            // check entrypoint
            const numEntryPoint = nodes.filter(e => e.node.type === "EntryPoint").length;
            if (numEntryPoint !== 1) {
                throw new Error(`An EntryPoint is required in group, got ${numEntryPoint}.`);
            }
            // check endpoint
            const numChatRoom = nodes.filter(e => e.node.type === "ChatRoom").length;
            if (numChatRoom !== 1) {
                throw new Error(`An ChatRoom is required in group, got ${numChatRoom}.`);
            }
            return new ChatRoomGroup(nodes)
        } catch (error) {
            return false
        }
    }

    nodes: ActionNodes;
    MAX_NUM_DYNAMIC_NODES = 32;

    /**
     * 
     * @param nodes 
     */
    constructor(nodes: ActionNodes) {
        this.nodes = nodes
    }

    /**
     * 
     * @param myNodes 
     * @param myEdges 
     * @returns 
     */
    async runPipeline(myNodes: ReactFlowNode[], myEdges: ReactFlowEdge[]): Promise<ActionNodes> {
        // get Nodes
        let ChatRoomNode = this.nodes.find(e => e.node.type === "ChatRoom"),
            EntryPointNode = this.nodes.find(e => e.node.type === "EntryPoint");
        if (!ChatRoomNode) { throw new Error("ChatRoom not found."); }
        if (!EntryPointNode) { throw new Error("EntryPoint not found."); }

        // sync ChatRoom messages        
        const messages: ChatRoomMessage[] = ChatRoomNode.node.data?.messages;
        if (!Array.isArray(messages)) { throw new Error("Cannot find ChatRoom messages.") }
        if (messages.length === 0) { throw new Error("ChatRoom message is empty.") }
        let usrMsg = messages[messages.length - 1];
        if (usrMsg?.role !== "user") { throw new Error(`Last message should from user, but get: \n${JSON.stringify(usrMsg, null, "\t")}`) }
        EntryPointNode.node.data = {
            ...EntryPointNode.node.data,
            messages
        }

        // run pipeline
        for (let index = 0; index < Math.min(this.nodes.length, this.MAX_NUM_DYNAMIC_NODES); index++) {
            this.nodes = await Promise.all(this.nodes.map((actNode) => {
                // get pipeline sources
                const sourceNodes: ReactFlowNode[] = getIncomers(actNode.node, myNodes, myEdges);
                // get actions of sources
                const sourceActNodes = sourceNodes.map((node) => {
                    const act = this.nodes.find((actNode) => actNode.node.id === node.id);
                    if (act) { return act }
                    throw new Error(`Can't found node id: ${node.id}`)
                })
                // run actNode action and return
                return actNode.action(sourceActNodes);
            }))
        }
        return this.nodes
    }
}