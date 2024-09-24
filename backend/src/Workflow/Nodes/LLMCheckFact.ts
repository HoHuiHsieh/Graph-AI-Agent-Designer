/**
 * @author HoHui Hsieh
 */
import { Node } from "reactflow";
import { DynamicNodeAction, InputData, Message } from "./base";
import { routeLLMFuncCall } from "../../API";


interface Output {
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
export default class LLMCheckFactAction extends DynamicNodeAction {

    model: string;
    parameters: Parameters;
    prompt: string;
    input: InputData = {};
    output: Output = {};

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
    async action(sources: DynamicNodeAction[]): Promise<LLMCheckFactAction> {
        let t0 = performance.now();

        // check state
        if (this.checkCompleted()) { return this }
        if (sources.some(e => !e.checkCompleted())) { return this }

        // check inputs
        this.input = this.mergeSources(sources.map(e => e?.output || {}));
        let { assistant, instruction } = this.input;
        if (!assistant) { throw new Error("'assistant' are required.") }
        if (!instruction) { throw new Error("'instruction' are required.") }

        // get input text
        let text = assistant.slice(assistant.length - 1).reduce((txt, msg) => {
            return txt += `${msg.content.replace(/(\r\n|\n|\r)/gm, "").trim()}\n`
        }, "");

        // get evidences
        let evidence = instruction.reduce((txt, msg) => {
            return txt += `${msg.content.replace(/(\r\n|\n|\r)/gm, "").trim()}\n`
        }, "");

        // get guardrail prompt 
        let guard_prompt = "";
        if (this.prompt.includes("{{ prompt }}") && this.prompt.includes("{{ evidence }}")) {
            guard_prompt = this.prompt.replace("{{ prompt }}", text).replace("{{ evidence }}", evidence);
        } else {
            throw new Error("事實檢查Prompt需要 {{ evidence }} 和 {{ prompt }} 標籤")
        }
        if (!guard_prompt.trim()) { throw new Error("遺失事實檢查Prompt") }
        console.log(guard_prompt);        

        // exetcute
        const function_call = await routeLLMFuncCall({
            model: this.model,
            messages: [{ role: "user", content: guard_prompt }],
            parameters: {
                max_token: this.parameters.max_token,
                penalty: this.parameters.penalty,
                temperature: this.parameters.temperature,
                top_k: this.parameters.top_k,
                top_p: this.parameters.top_p,
            },
            functions: [
                {
                    name: "check_evidence",
                    description: "判斷假設是否有依據且包含在證據中",
                    properties: [{
                        name: "pass",
                        type: "boolean",
                        description: "Return true if checks are passed; otherwise, return false.",
                        required: true,
                    }]
                }
            ],
        });

        // update node data
        if (function_call?.name === "check_evidence") {
            if (Boolean(function_call.arguments.pass)) {
                this.setCompleted()
                return this
            }
        }
        throw new Error("回答與事實不符！")
    }
}