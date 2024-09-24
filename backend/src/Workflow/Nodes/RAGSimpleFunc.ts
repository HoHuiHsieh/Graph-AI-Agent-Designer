/**
 * @author HoHui Hsieh
 */
import { Node } from "reactflow";
import { DynamicNodeAction, InputData, Message } from "./base";
import moment from "moment";
import { retrievedb } from "../../RagSimple";


interface Output {
    function?: {
        name: string,
        arguments: { [key: string]: any },
        elapsed_time?: number,
    }
}

interface Parameters {
    chunkOverlap: number;
    chunkSize: number;
    keepSeparator: boolean;
    separator: string;
    threshold: number;
}

interface Document {
    text: string,
    function: string,
}

/**
 * 
 */
export default class RAGSimpleFuncAction extends DynamicNodeAction {

    id: string;
    model: string;
    documents: Document[];
    parameters: Parameters;

    input: InputData = {};
    output: Output = {
        function: undefined
    };

    constructor(node: Node) {
        super(node);

        this.id = node.data.id;
        if (!this.id) { throw new Error("'id' is required.") }

        this.model = node.data.model;
        if (!this.model) { throw new Error("'model' is required.") }

        this.documents = node.data.documents;
        if (!Array.isArray(this.documents)) { throw new Error("'documents' is required.") };
        for (let index = 0; index < this.documents.length; index++) {
            const doc = this.documents[index];
            if (!(typeof doc.text === "string")) { throw new Error(`'documents[${index}].text' should be string.`) };
            if (!(typeof doc.function === "string")) { throw new Error(`'documents[${index}].function' should be string.`) };
        }

        this.parameters = node.data.parameters;
        if (!this.parameters.chunkOverlap) { throw new Error("'chunkOverlap' is required.") }
        if (!this.parameters.chunkSize) { throw new Error("'chunkSize' is required.") }
        if (typeof this.parameters.keepSeparator !== "boolean") { throw new Error("'keepSeparator' is required.") }
        if (!this.parameters.separator) { throw new Error("'separator' is required.") }
        if (!this.parameters.threshold) { throw new Error("'threshold' is required.") }
    }

    /**
     * 
     * @param sources 
     */
    async action(sources: DynamicNodeAction[]): Promise<RAGSimpleFuncAction> {
        let t0 = performance.now();

        // check state
        if (this.checkCompleted()) { return this }
        if (sources.some(e => !e.checkCompleted())) { return this }


        // check inputs
        this.input = this.mergeSources(sources.map(e => e?.output || {}));
        let { prompt } = this.input;
        if (!Array.isArray(prompt)) { throw new Error("'prompt' is required.") }

        // exetcute
        let results = await retrievedb({
            id: this.id,
            messages: prompt,
            threshold: this.parameters.threshold,
            num_retrieve: 1,
        })
        let func = this.documents.find(e => e.text == results[0]);

        // update node data
        if (func?.function) {
            let call: {
                name: string,
                arguments: {
                    [arg: string]: string,
                }
            } = JSON.parse(func.function);
            if (!call?.name) { throw new Error("'name' is required in function call.") }
            if (!call?.arguments) { throw new Error("'arguments' is required in function call.") }
            if ("name" in call && typeof call.name === "string" && "arguments" in call && typeof call.arguments === "object") {
                this.output.function = {
                    name: call.name,
                    arguments: call.arguments
                }
            } else {
                throw new Error("'arguments' is invalid in function call.")
            }
        }
        this.setCompleted()
        return this
    }

}