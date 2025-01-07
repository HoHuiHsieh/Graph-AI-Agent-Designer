/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { ReactFlowNode, ChatRoomMessage } from "../typedef";
import { ActionNodes, DynamicNodeAction, LLMParameters, PIPELINE_NODES } from "./typedef";
import { ToolUse } from "../../Models/ChatCompletion";


interface GuardrailNode extends ReactFlowNode {
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
export default class GuardraiAction extends DynamicNodeAction {

    node: GuardrailNode;

    /**
     * 
     * @param node 
     */
    constructor(node: GuardrailNode) {
        super(node);
        this.node = node;
    }

    /**
     * 
     * @param sources
     * @returns 
     */
    async action(sources: ActionNodes): Promise<GuardraiAction> {
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

        // run tool use
        if (!this.node.data.prompt.includes("{{ message }}")) {
            throw new Error("'{{ message }}' is required in Guardrail prompt.")
        }
        const msgs: ChatRoomMessage[] = [{
            role: "user",
            content: this.node.data.prompt.replace("{{ message }}", messages[messages.length - 1].content)
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
            this.node.data.messages = messages;
            this.node.data.elapsed_time = performance.now() - t0;
            this.setCompleted();
            return this
        }
        throw new Error("The message does not comply with the guardrail rule.")
    }

}