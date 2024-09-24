/**
 * @author HoHui Hsieh
 */
import { Node } from "reactflow";
import { DynamicNodeAction, InputData, Message } from "./base";
import { routeInferLLMChat } from "../../API";
import moment from "moment";


interface Output {
    prompt: Message[]
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
export default class LLMSummarizeAction extends DynamicNodeAction {

    model: string;
    parameters: Parameters;
    prompt: string;
    input: InputData = {};
    output: Output = {
        prompt: []
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

        this.prompt = node.data.prompt;
        if (!this.prompt) { throw new Error("'prompt' is required.") }
    }

    /**
     * 
     */
    async action(sources: DynamicNodeAction[]): Promise<LLMSummarizeAction> {
        let t0 = performance.now();

        // check state
        if (this.checkCompleted()) { return this }
        if (sources.some(e => !e.checkCompleted())) { return this }

        // check inputs
        this.input = this.mergeSources(sources.map(e => e?.output || {}));
        let { prompt } = this.input;
        if (!Array.isArray(prompt)) { throw new Error("'prompt' is required.") }
        if (prompt.length < 5) {
            this.output.prompt = prompt;
            this.setCompleted()
            return this
        }
        
        // insert description
        let s_ind = Math.max(prompt.length - 21, 0);
        let last_user_msg = prompt.slice(prompt.length - 1),
            text = prompt.slice(s_ind, prompt.length - 1).reduce((txt, msg) => {
                let talker = msg.role === "user" ? "Question: " : msg.role === "assistant" ? "Answer: " : "Unknown: ";
                return txt += `${talker}: ${msg.content.replace(/(\r\n|\n|\r)/gm, "")}\n`
            }, "");
        let summarize_prompt = "";
        if (this.prompt.includes("{{ prompt }}")) {
            summarize_prompt = this.prompt.replace("{{ prompt }}", text);
        } else {
            summarize_prompt += `\n${text}`;
        }

        // exetcute
        const generated_text = await routeInferLLMChat({
            model: this.model,
            messages: [{
                role: "user",
                content: summarize_prompt
            }],
            parameters: {
                max_token: this.parameters.max_token,
                penalty: this.parameters.penalty,
                temperature: this.parameters.temperature,
                top_k: this.parameters.top_k,
                top_p: this.parameters.top_p,
            }
        });

        // update node data
        this.output.prompt = [
            {
                role: "user",
                content: `對話摘要：\n${generated_text}`,
                timestamp: moment().format("HH:mm"),
                elapsed_time: performance.now() - t0,
            },
            {
                role: "assistant",
                content: "",
                timestamp: moment().format("HH:mm"),
                elapsed_time: performance.now() - t0,
            },
            ...last_user_msg,
        ]

        this.setCompleted()
        return this
    }
}