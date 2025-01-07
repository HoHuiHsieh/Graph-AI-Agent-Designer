/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { ReactFlowNode, ChatRoomMessage } from "../typedef";
import { ActionNodes, DynamicNodeAction, LLMParameters, PIPELINE_NODES } from "./typedef";
import { ToolUse } from "../../Models/ChatCompletion";


interface CheckFactNode extends ReactFlowNode {
    data: {
        llm: {
            model: string,
            parameters: LLMParameters,
        },
        tool: {
            name: string,
            description: string,
            properties: {
                name: string,
                type: string,
                description: string,
                required: boolean,
            }[],
        },
        prompt: string,
        messages?: ChatRoomMessage[],
        elapsed_time?: number,
    }
}

/** */
export default class CheckFactAction extends DynamicNodeAction {

    node: CheckFactNode;

    /**
     * 
     * @param node 
     */
    constructor(node: CheckFactNode) {
        super(node);
        this.node = node;
    }

    /**
     * 
     * @param sources
     * @returns 
     */
    async action(sources: ActionNodes): Promise<CheckFactAction> {
        const t0 = performance.now();

        // check state
        if (this.checkCompleted()) { return this }
        if (sources.some(e => !e.checkCompleted())) { return this }

        // get messages
        const parent = sources.find(e => PIPELINE_NODES.includes(e.node.type));
        if (!parent) { throw new Error("Pipeline source not connected.") }
        let messages: ChatRoomMessage[] = parent.node.data?.messages || [];
        if (messages.length === 0) { throw new Error("Messages is empty.") }
        if (messages[messages.length - 1].role !== "user") { throw new Error("The last message should come from the user.") }

        // skip if no documents
        const msg = messages[messages.length - 1],
            docs = msg?.docs;
        if (!docs) {
            this.node.data.messages = messages;
            this.node.data.elapsed_time = performance.now() - t0;
            this.setCompleted();
            return this
        }

        // run tool use
        if (!this.node.data.prompt.includes("{{ message }}")) {
            throw new Error("'{{ message }}' is required in CheckFact prompt.")
        }
        if (!this.node.data.prompt.includes("{{ evidence }}")) {
            throw new Error("'{{ evidence }}' is required in CheckFact prompt.")
        }
        const msgs: ChatRoomMessage[] = [{
            role: "user",
            content: this.node.data.prompt.replace("{{ message }}", msg.content).replace("{{ evidence }}", docs.join("\n"))
        }]
        const cmd = await ToolUse({
            model: this.node.data.llm.model,
            messages: msgs,
            parameters: this.node.data?.llm.parameters,
            functions: [this.node.data?.tool].map(e => ({
                name: e.name,
                description: e.description,
                properties: e.properties,
            }))
        })
        // pass messages
        const args = cmd?.arguments || {},
            passed = Object.keys(args).some(key=>Boolean(args[key]));
        if (cmd.name === this.node.data?.tool?.name && passed) {
            messages[messages.length - 1].is_valid = true;
        }
        this.node.data.messages = messages;
        this.node.data.elapsed_time = performance.now() - t0;
        this.setCompleted();
        return this
    }

}