/**
 * @author HoHui Hsieh
 */
import { Node } from "reactflow";
import { DynamicNodeAction, InputData } from "./base";
import { retrievedb } from "../../RagSimple";


interface Output { }

interface Parameters {
    chunkOverlap: number;
    chunkSize: number;
    keepSeparator: boolean;
    separator: string;
    threshold: number;
}

interface Document {
    text: string,
    immoral: boolean,
}

/**
 * 
 */
export default class RAGCheckInputAction extends DynamicNodeAction {

    id: string;
    model: string;
    documents: Document[];
    parameters: Parameters;
    input: InputData = {};
    output: Output = {};

    constructor(node: Node) {
        super(node);

        this.id = node.data.id;
        if (!this.id) { throw new Error("'id' is required.") }

        this.model = node.data.model;
        if (!this.model) { throw new Error("'model' is required.") }

        this.documents = node.data.documents;
        if (!Array.isArray(this.documents)) { throw new Error("'documents' is required.") };
        for (let index = 0; index < this.documents.length; index++) {
            let doc = this.documents[index];
            if (!(typeof doc.text === "string")) { throw new Error(`'documents[${index}].text' should be string.`) };
            doc.immoral = JSON.parse(`${doc.immoral}`.toLowerCase())
            this.documents[index].immoral = doc.immoral;
            if (!(typeof doc.immoral === "boolean")) { throw new Error(`'documents[${index}].immoral' should be string.`) };
        }

        this.parameters = node.data.parameters;
        if (!this.parameters.chunkOverlap) { throw new Error("'chunkOverlap' is required.") }
        if (!this.parameters.chunkSize) { throw new Error("'chunkSize' is required.") }
        if (!this.parameters.keepSeparator) { throw new Error("'keepSeparator' is required.") }
        if (!this.parameters.separator) { throw new Error("'separator' is required.") }
        if (!this.parameters.threshold) { throw new Error("'threshold' is required.") }
    }

    /**
     * 
     * @param sources 
     */
    async action(sources: DynamicNodeAction[]): Promise<RAGCheckInputAction> {

        // check state
        if (this.checkCompleted()) { return this }
        if (sources.some(e => !e.checkCompleted())) { return this }


        // check inputs
        this.input = this.mergeSources(sources.map(e => e?.output || {}));
        let { prompt } = this.input;
        if (!Array.isArray(prompt)) { throw new Error("'prompt' is required.") }

        // exetcute
        let result = await retrievedb({
            id: this.id,
            messages: prompt,
            threshold: this.parameters.threshold,
            num_retrieve: 1,
        })

        // update node data
        let doc = this.documents.find(e => e.text == result[0]);
        if (doc?.immoral) {
            throw new Error("輸入文字違反檢查規則！")
        }

        this.setCompleted()
        return this
    }

}