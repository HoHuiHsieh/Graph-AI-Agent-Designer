/**
 * @author HoHui Hsieh
 */
import { EmbeddingsInterface } from "@langchain/core/embeddings";
import { routeEmbedding } from "../../../API";
import { EmbeddingProps, EmbeddingData } from "../../../API/typedef";


/**
 * 
 * @param model 
 * @returns 
 */
export function getEmbeddingModel(model: string): EmbeddingsInterface {
    const { infer } = routeEmbedding(model);
    return new Embeddings(model, infer);
}

/**
 * 
 */
class Embeddings {

    model: string;
    infer: (props: EmbeddingProps) => Promise<{ data: EmbeddingData[] }>

    /**
     * 
     * @param model 
     */
    constructor(model: string, infer: any) {
        this.model = model;
        this.infer = infer;
    }

    /**
     * 
     * @param documents 
     * @returns 
     */
    async embedDocuments(documents: string[]): Promise<number[][]> {
        let chunks = []
        while (documents.length > 0)
            chunks.push(documents.splice(0, 1024));

        let response = await Promise.all(chunks.map(docs => this.infer({
            model: this.model,
            inputs: docs
        })))
        let result = response.flatMap(e => e.data.map(e => e.embedding));
        return result
    }

    /**
     * 
     * @param document 
     * @returns 
     */
    async embedQuery(document: string): Promise<number[]> {
        let result = await this.infer({
            model: this.model,
            inputs: [document]
        })
        return result.data[0].embedding
    }
}
