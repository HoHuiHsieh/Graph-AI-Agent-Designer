/**
 * @author HoHui Hsieh
 */
import { Node } from "reactflow";
import { DynamicNodeAction, InputData, Message } from "./base";
import { routeInferLLMChat, routeLLMFuncCall } from "../../API";
import moment from "moment";


interface Output {
    function?: {
        name: string,
        arguments: { [key: string]: any },
        elapsed_time?: number,
    }
}

interface Parameters {
    penalty: number,
    top_k: number,
    top_p: number,
    temperature: number,
    max_token: number
}

interface Function {
    name: string,
    description: string,
    properties: {
        name: string,
        type: string,
        description?: string,
        enum?: string[],
        required: boolean,
    }[]
}

/**
 * 
 */
export default class LLMFunctionCallAction extends DynamicNodeAction {

    model: string;
    parameters: Parameters;
    functions: Function[];
    input: InputData = {};
    output: Output = {
        function: undefined
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

        this.functions = node.data.functions;
        if (!Array.isArray(this.functions)) { throw new Error("'functions' should be array.") }
        for (let index = 0; index < this.functions.length; index++) {
            const func = this.functions[index];
            if (!func.name) { throw new Error(`'function[${index}].name' is required.`) }
            if (!func.description) { throw new Error(`'function[${index}].description' is required.`) }
            for (let index_2 = 0; index_2 < func.properties.length; index_2++) {
                const props = func.properties[index_2];
                if (!props.name) { throw new Error(`'function[${index}].properties[${index_2}].name' is required.`) }
                if (!props.type) { throw new Error(`'function[${index}].properties[${index_2}].type' is required.`) }
                if (!props.description) { throw new Error(`'function[${index}].properties[${index_2}].description' is required.`) }
                if (!(typeof props.required == "boolean")) { throw new Error(`'function[${index}].properties[${index_2}].required' is required.`) }
            }
        }
    }

    /**
     * 
     */
    async action(sources: DynamicNodeAction[]): Promise<LLMFunctionCallAction> {
        let t0 = performance.now();

        // check state
        if (this.checkCompleted()) { return this }
        if (sources.some(e => !e.checkCompleted())) { return this }

        // check inputs
        this.input = this.mergeSources(sources.map(e => e?.output || {}));
        let { messages } = this.input;
        if (!messages) { throw new Error("Messages are required.") }

        // exetcute
        const function_call = await routeLLMFuncCall({
            model: this.model,
            messages: messages,
            parameters: {
                max_token: this.parameters.max_token,
                penalty: this.parameters.penalty,
                temperature: this.parameters.temperature,
                top_k: this.parameters.top_k,
                top_p: this.parameters.top_p,
            },
            functions: this.functions,
        });


        // update node data
        this.output.function = {
            ...function_call,
            elapsed_time: performance.now() - t0,
        }
        this.setCompleted()
        return this
    }
}