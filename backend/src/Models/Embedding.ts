/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { modelList } from "../API";
import OpenAIEmbedding from "../API/openai/embeddings";


export interface EmbeddingRequest {
    model: string,
    input: string[],
}

/**
 * 
 * @param props 
 * @returns 
 */
export async function Embedding(props: EmbeddingRequest): Promise<number[][]> {
    // get model
    const model = modelList.embedding.find(e => e.value === props?.model);
    if (!model) { throw new Error("Embedding model not found.") }
    if (!Array.isArray(props.input)) { throw new Error("Documents not found.") }
    // switch model
    switch (model.ref) {
        case "OpenAI":
            const openaiEmbeddings = await OpenAIEmbedding({
                model: props.model,
                input: props.input,
            });
            return openaiEmbeddings

        default:
            throw new Error("Embedding model not found.");
    }
}
