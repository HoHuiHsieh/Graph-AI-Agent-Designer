/**
 * @author HoHui Hsieh
 */
import { Node } from "reactflow";
import { DynamicNodeAction, InputData, Message } from "./base";


interface Output {
    assistant: Message[]
}

/**
 * 
 */
export default class ChatRoomAction extends DynamicNodeAction {

    input: InputData = {};
    output: Output = {
        assistant: []
    };

    constructor(node: Node) {
        super(node);
    }

    /**
     * 
     */
    async action(sources: DynamicNodeAction[]): Promise<ChatRoomAction> {
        // check state
        if (this.checkCompleted()) { return this }
        if (sources.some(e => !e.checkCompleted())) { return this }

        // check inputs
        this.input = this.mergeSources(sources.map(e => e?.output || {}));
        let { assistant } = this.input;
        if (!assistant) { throw new Error("Failed to get assistant.") }

        // update node data
        this.output.assistant = assistant;
        this.setCompleted()
        return this
    }

}