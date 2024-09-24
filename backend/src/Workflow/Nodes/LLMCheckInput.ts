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
export default class LLMCheckInputAction extends DynamicNodeAction {

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
    async action(sources: DynamicNodeAction[]): Promise<LLMCheckInputAction> {
        let t0 = performance.now();

        // check state
        if (this.checkCompleted()) { return this }
        if (sources.some(e => !e.checkCompleted())) { return this }

        // check inputs
        this.input = this.mergeSources(sources.map(e => e?.output || {}));
        let { prompt } = this.input;
        if (!prompt) { throw new Error("'prompt' are required.") }

        // get input text
        let text = prompt.slice(prompt.length - 1).reduce((txt, msg) => {
            return txt += `${msg.content.replace(/(\r\n|\n|\r)/gm, "")}\n`
        }, "");
        let guard_prompt = "";
        if (this.prompt.includes("{{ prompt }}")) {
            guard_prompt = guard_prompt.replace("{{ prompt }}", text);
        } else {
            throw new Error("Prompt需要 {{ prompt }} 標籤")
        }

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
        throw new Error("輸入文字違反檢查規則！")
    }
}