/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { ReactFlowNode, ChatRoomMessage } from "../typedef";
import { ActionNodes, DynamicNodeAction, PIPELINE_NODES } from "./typedef";


interface ChatRoomNode extends ReactFlowNode {
    data: {
        prompt: string,
        messages: ChatRoomMessage[],
        elapsed_time?: number,
    }
}

/** */
export default class ChatRoomAction extends DynamicNodeAction {

    node: ChatRoomNode;

    /**
     * 
     * @param node 
     */
    constructor(node: ChatRoomNode) {
        super(node);
        this.node = node;
    }

    /**
     * 
     * @param sources
     * @returns 
     */
    async action(sources: ActionNodes): Promise<ChatRoomAction> {
        const t0 = performance.now();

        // check state
        if (this.checkCompleted()) { return this }
        if (sources.some(e => !e.checkCompleted())) { return this }

        // get messages
        const parent = sources.find(e => PIPELINE_NODES.includes(e.node.type));
        if (!parent) { throw new Error("Pipeline source not connected.") }
        let messages: ChatRoomMessage[] = parent.node.data?.messages || [];
        if (messages.length === 0) { throw new Error("Messages is empty.") }
        if (messages[messages.length - 1].role !== "assistant") { throw new Error("The last message should come from the assistant.") }

        this.node.data.messages = messages;
        this.node.data.elapsed_time = performance.now() - t0;
        this.setCompleted();
        return this
    }

}