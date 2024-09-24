/**
 * interfaces 
 * @author HoHui Hsieh
 */

export interface LLMInferenceProps {
    model: string,
    messages: {
        role: "user" | "assistant" | "system",
        content: string,
    }[],
    parameters: {
        max_token: number,
        temperature: number,
        top_k: number,
        top_p: number,
        penalty: number,
    },
    functions?: {
        name: string,
        description: string,
        properties: {
            name: string,
            type: string,
            description?: string,
            enum?: string[],
            required: boolean,
        }[]
    }[],
}

export interface ModelType {
    label: string;
    value: string;
    ref: string;
}

export type FuncCallResponse = {
    name: string,
    arguments: {
        [arg: string]: string,
    }
}


export interface EmbeddingProps {
    model: string,
    inputs: string[]
}


export type EmbeddingData = {
    embedding: number[],
    index: number,
    object: string,
}