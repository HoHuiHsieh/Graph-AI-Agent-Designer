/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { Document } from "@langchain/core/documents";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { ContextualCompressionRetriever } from "langchain/retrievers/contextual_compression";
import { EmbeddingsFilter } from "langchain/retrievers/document_compressors/embeddings_filter";
import EmbeddingModel from "./model";
import { loadFile } from "./document";



export default class Session {
    file: File;
    timeoutID?: NodeJS.Timeout;
    documents?: Document[];
    retriever?: ContextualCompressionRetriever;
    EMBEDDING_MODEL: string = "text-embedding-3-small";
    SIMILARITY_TRHESHOLD: number = 0.1;
    MAXIMUM_RETRIEVED: number = 2;

    /**
     * 
     * @param file 
     * @returns 
     */
    static upload(file: File): Session {
        return new Session(file)
    }

    /**
     * 
     * @param file 
     */
    constructor(file: File) {
        this.file = file
    }

    /**
     * 
     * @param model 
     */
    async build(model?: string): Promise<void> {
        try {
            // prepare model
            if (model) { this.EMBEDDING_MODEL = model; }
            const embdModel = new EmbeddingModel(this.EMBEDDING_MODEL);
            // get documents
            const docs = await loadFile(this.file);
            // build vectors
            const vectorStore = await HNSWLib.fromDocuments(docs, embdModel);
            // build retriever
            const baseCompressor = new EmbeddingsFilter({
                embeddings: embdModel,
                similarityThreshold: this.SIMILARITY_TRHESHOLD,
                k: this.MAXIMUM_RETRIEVED,
            })
            const retriever = new ContextualCompressionRetriever({
                baseCompressor,
                baseRetriever: vectorStore.asRetriever()
            })
            // finishing
            this.documents = docs;
            this.retriever = retriever;
        } catch (error) {
            this.documents = undefined;
            this.retriever = undefined;
            throw error;
        }
    }

    /**
     * 
     * @param prompt 
     * @returns 
     */
    async retrieve(prompt: string): Promise<string[]> {
        if (!this.retriever) { throw new Error("Retriever not been built.") }
        const retrieved = await this.retriever.invoke(prompt);
        const results = retrieved.map(e => e.pageContent);
        return results
    }
}
