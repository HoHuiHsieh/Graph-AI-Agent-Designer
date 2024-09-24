/**
 * @author HoHui Hsieh
 */
import { Node } from "reactflow";
import { DynamicNodeAction, InputData, Message } from "./base";
import { routeInferLLMChat } from "../../API";
import moment from "moment";


interface Output {
    assistant: Message[]
}

interface Parameters {
    penalty: number,
    top_k: number,
    top_p: number,
    temperature: number,
    max_token: number
}

/**
 * 
 */
export default class LLMChatCompletionAction extends DynamicNodeAction {

    model: string;
    parameters: Parameters;
    input: InputData = {};
    output: Output = {
        assistant: []
    };

    constructor(node: Node) {
        super(node);

        this.model = node.data.model;
        if (!this.model) { throw new Error("'model' is required.") }

        this.parameters = node.data.parameters;
        if (!this.parameters.penalty) { throw new Error("'penalty' is required.") }
        if (!this.parameters.top_k) { throw new Error("'top_k' is required.") }
        if (!this.parameters.top_p) { throw new Error("'top_p' is required.") }
        if (!this.parameters.temperature) { throw new Error("'temperature' is required.") }
        if (!this.parameters.max_token) { throw new Error("'max_token' is required.") }
    }

    /**
     * 
     */
    async action(sources: DynamicNodeAction[]): Promise<LLMChatCompletionAction> {
        let t0 = performance.now();

        // check state
        if (this.checkCompleted()) { return this }
        if (sources.some(e => !e.checkCompleted())) { return this }

        // check inputs
        this.input = this.mergeSources(sources.map(e => e?.output || {}));
        let { prompt, messages } = this.input;
        if (!messages) { throw new Error("Messages are required.") }
        
        // exetcute
        const generated_text = await routeInferLLMChat({
            model: this.model,
            messages: messages,
            parameters: {
                max_token: this.parameters.max_token,
                penalty: this.parameters.penalty,
                temperature: this.parameters.temperature,
                top_k: this.parameters.top_k,
                top_p: this.parameters.top_p,
            }
        });

        // update node data
        this.output.assistant = [
            ...(prompt || []),
            {
                role: "assistant",
                content: generated_text,
                timestamp: moment().format("HH:mm"),
                elapsed_time: performance.now() - t0,
            }
        ]

        this.setCompleted()
        return this
    }
}