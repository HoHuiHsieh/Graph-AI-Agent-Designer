/**
 * @author HoHui Hsieh
 */
import { Node } from "reactflow";
import { DynamicNodeAction, InputData, Message } from "./base";
import moment from "moment";
import { retrievedb } from "../../RagSimple";


interface Output {
    instruction: Message[]
}

interface Parameters {
    chunkOverlap: number;
    chunkSize: number;
    keepSeparator: boolean;
    separator: string;
    num_retrieve: number,
    threshold: number;
}

interface Document {
    text: string,
    placeholder?: string,
}

/**
 * 
 */
export default class RAGSimpleInstAction extends DynamicNodeAction {

    id: string;
    model: string;
    documents: Document[];
    parameters: Parameters;

    input: InputData = {};
    output: Output = {
        instruction: []
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
            if (!(typeof doc.placeholder === "string")) { throw new Error(`'documents[${index}].placeholder' should be string.`) };
        }

        this.parameters = node.data.parameters;
        if (!this.parameters.chunkOverlap) { throw new Error("'chunkOverlap' is required.") }
        if (!this.parameters.chunkSize) { throw new Error("'chunkSize' is required.") }
        if (typeof this.parameters.keepSeparator !== "boolean") { throw new Error("'keepSeparator' is required.") }
        if (!this.parameters.separator) { throw new Error("'separator' is required.") }
        if (!this.parameters.num_retrieve) { throw new Error("'num_retrieve' is required.") }
        if (!this.parameters.threshold) { throw new Error("'threshold' is required.") }
    }

    /**
     * 
     * @param sources 
     */
    async action(sources: DynamicNodeAction[]): Promise<RAGSimpleInstAction> {
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
            num_retrieve: this.parameters.num_retrieve,
        })
        let text = results.reduce((txt, doc, index) => {
            let raw = this.documents.find(e => e.text == doc);
            txt += (raw?.placeholder || doc);
            if (index + 1 < results.length) {
                txt += `\n\n---\n\n`;
            } else {
                txt += `\n`;
            }
            return txt
        }, "")

        // update node data
        this.output.instruction = [
            {
                role: "user",
                content: `${text}`,
                timestamp: moment().format("HH:mm"),
                elapsed_time: performance.now() - t0,
            },
            {
                role: "assistant", content: "",
                timestamp: moment().format("HH:mm"),
                elapsed_time: performance.now() - t0,
            }
        ]

        this.setCompleted()
        return this
    }

}