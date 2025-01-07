/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import OpenAI from "openai";


const openai = new OpenAI();

export interface EmbeddingsProps {
    model: string,
    input: string[],
}

/**
 * 
 * @param props 
 * @returns 
 */
export default async function Embedding(props: EmbeddingsProps): Promise<number[][]> {
    const embedding = await openai.embeddings.create({
        model: props.model,
        input: props.input,
        encoding_format: "float",
    });
    return embedding.data.map(e => e.embedding)
}

/** */
export const embeddings = [
    { label: "Text Embedding 3 small", value: "text-embedding-3-small", ref: "OpenAI",  },
    { label: "Text Embedding 3 large", value: "text-embedding-3-large", ref: "OpenAI",  },
    { label: "Text Embedding Ada", value: "text-embedding-ada-002", ref: "OpenAI",  },
]
