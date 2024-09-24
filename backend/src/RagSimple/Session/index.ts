/**
 * @author HoHui Hsieh
 */
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { BuildRequestBody, RetrieveRequestBody } from "./typedef";
import FileDB from "./FileDB";
import { getEmbeddingModel } from "./Model";
import { parseDocuments } from "./Docs";
import { ParseDocumentsProps } from "./Docs/typedef";


/**
 * 
 */
export default class Session {

    id: string;
    model: string;
    vectorStore: HNSWLib;
    params: ParseDocumentsProps;
    static folder: string = "/root/ai-agent/backend/temp";

    /**
     * 
     * @param id 
     * @param model 
     * @param vectorStore 
     * @param params 
     */
    constructor(id: string, model: string, vectorStore: HNSWLib, params: ParseDocumentsProps) {
        this.id = id;
        this.model = model;
        this.vectorStore = vectorStore;
        this.params = params;
        if (!this.id) { throw new Error("'id' is required.") }
        if (!this.model) { throw new Error("'model' is required.") }
        if (!this.vectorStore) { throw new Error("'vectorStore' is required.") }
        if (!this.params) { throw new Error("'params' is required.") }
    }

    /**
     * Load RAG database from folder.
     * @param id 
     * @param folder 
     * @param model 
     * @returns 
     */
    static async load(id: string, folder: string, model: string): Promise<Session> {
        let embeddingModel = getEmbeddingModel(model);
        let vectorStore = await HNSWLib.load(folder, embeddingModel);
        let params = FileDB.readJson(`${folder}/params.json`);
        return new Session(id, model, vectorStore, params)
    }

    /**
     * Build RAG database from documents.
     * @param id 
     * @param props 
     * @returns 
     */
    static async build(id: string, props: BuildRequestBody): Promise<Session> {
        let embeddingModel = getEmbeddingModel(props.model);

        // process documents
        let docs = await parseDocuments(props.parameters, props.documents);

        // build vector store
        let vectorStore = await HNSWLib.fromDocuments(docs, embeddingModel);

        // save vectorStore
        let foldername = `${Session.folder}/${id}`;
        await vectorStore.save(foldername);

        // save parameters
        FileDB.dumpJson(props, `${foldername}/params.json`);

        // pack database to a tar file.
        FileDB.pack(foldername);

        // return self
        return new Session(id, props.model, vectorStore, props.parameters)
    }

    /**
     * Retrieve data from RAG DB.
     * @param data 
     * @returns 
     */
    async retrieve(body: RetrieveRequestBody): Promise<string[]> {
        if (!this.vectorStore) { throw new Error("RAG database not being built!") }
        let query = body.messages[body.messages.length - 1].content;
        const response = await this.vectorStore.similaritySearchWithScore(query, body.num_retrieve || 1);
        let results = response.reduce((arr, e) => {
            if (e[1] < body.threshold) {
                arr.push(e[0].pageContent)
            }
            return arr
        }, [] as string[])
        return results
    }
}


