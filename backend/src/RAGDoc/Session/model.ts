/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { Embedding as EmbeddingFunction } from "../../Models";


/** */
export default class Embeddings {
    model: string;

    /**
     * 
     * @param model 
     */
    constructor(model: string) {
        this.model = model;
    }

    /**
     * 
     * @param documents 
     * @returns 
     */
    embedDocuments(documents:string[]):Promise<number[][]>{
        return this.infer(documents)
    }

    /**
     * 
     * @param document 
     * @returns 
     */
    async embedQuery(document:string):Promise<number[]>{
        let response = await this.infer([document]);
        return response[0]
    }

    /**
     * 
     * @param docs 
     * @returns 
     */
    private async infer(docs: string[]): Promise<number[][]> {
        return EmbeddingFunction({ model: this.model, input: docs })
    }
}