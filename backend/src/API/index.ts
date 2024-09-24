/**
 * add support for multiple LLM models and sources
 * @author HoHui Hsieh
 */
import { taide7b } from "./triton";
import { chatCompletion, functionCall, embedding } from "./twcc";
import { EmbeddingData, EmbeddingProps, FuncCallResponse, LLMInferenceProps, ModelType } from "./typedef"


// LLM model list
export const model_list = {
    chat: [
        { label: "Llama3-FFM-70B", value: "llama3-ffm-70b-chat", ref: "TWCC" },
        { label: "Llama3-FFM-8B", value: "llama3-ffm-8b-chat", ref: "TWCC" },
        { label: "FFM-Llama2-v2-70B", value: "llama3-ffm-70b-chat", ref: "TWCC" },
        { label: "FFM-Llama2-v2-7B", value: "ffm-llama2-7b-chat-exp", ref: "TWCC" },
        { label: "TAIDE-LX-7B-Chat", value: "taide-lx-7b-chat", ref: "TAIDE" }
    ] as ModelType[],
    function_call: [
        { label: "Llama3-FFM-70B", value: "llama3-ffm-70b-chat", ref: "TWCC" },
        { label: "Llama3-FFM-8B", value: "llama3-ffm-8b-chat", ref: "TWCC" },
        { label: "FFM-Llama2-v2-70B", value: "llama3-ffm-70b-chat", ref: "TWCC" },
        { label: "FFM-Llama2-v2-7B", value: "ffm-llama2-7b-chat-exp", ref: "TWCC" },
    ] as ModelType[],
    code_completion: [
        { label: "Llama3-FFM-70B", value: "llama3-ffm-70b-chat", ref: "TWCC" },
        { label: "TAIDE-LX-7B-Chat", value: "taide-lx-7b-chat", ref: "TAIDE" }
    ] as ModelType[],
    embedding: [
        { label: "FFM-embedding", value: "ffm-embedding", ref: "TWCC" }
    ] as ModelType[],
}


/**
 * add routeInferLLMChat function for LLM inference
 * @param props 
 * @returns 
 */
export async function routeInferLLMChat(props: LLMInferenceProps): Promise<string> {
    // get a model
    const model = model_list.chat.find(e => e.value == props.model);
    if (!model) { throw new Error("LLM not found.") }
    if (!props.messages) { throw new Error("Messages not found.") }

    // switch by model source
    switch (model.ref) {
        case "TWCC":
            const response = await chatCompletion({
                model: props.model,
                messages: props.messages,
                parameters: {
                    max_new_tokens: props.parameters.max_token,
                    frequence_penalty: props.parameters.penalty,
                    temperature: props.parameters.temperature,
                    top_k: props.parameters.top_k,
                    top_p: props.parameters.top_p,
                },
                stream: false
            });
            return response.generated_text;

        case "TAIDE":
            switch (model.value) {
                case "taide-lx-7b-chat":
                    return await taide7b.inference({
                        text_input: taide7b.parseChatMessages(props.messages),
                        max_tokens: props.parameters.max_token,
                        top_p: props.parameters.top_p,
                        top_k: props.parameters.top_k,
                        temperature: props.parameters.temperature,
                        penalty: props.parameters.penalty,
                    })

                default:
                    throw new Error("LLM not found.")
            }

        default:
            throw new Error("LLM reference not found.")
    }
}


/**
 * add routeInferLLMCode function for LLM code completion
 * @param props 
 * @returns 
 */
export async function routeInferLLMCode(props: LLMInferenceProps): Promise<string> {
    // get a model
    const model = model_list.code_completion.find(e => e.value == props.model);
    if (!model) { throw new Error("LLM not found.") }
    if (!props.messages) { throw new Error("Messages not found.") }
    if (props.messages.length > 2) { throw new Error("Too many code messages.") }

    // switch by model source
    switch (model.ref) {
        case "TWCC":
            const response = await chatCompletion({
                model: props.model,
                messages: props.messages,
                parameters: {
                    max_new_tokens: props.parameters.max_token,
                    frequence_penalty: props.parameters.penalty,
                    temperature: props.parameters.temperature,
                    top_k: props.parameters.top_k,
                    top_p: props.parameters.top_p,
                },
                stream: false
            });
            return response.generated_text;

        case "TAIDE":
            switch (model.value) {
                case "taide-lx-7b-chat":
                    return await taide7b.inference({
                        text_input: taide7b.parseCodeMessages(props.messages),
                        max_tokens: props.parameters.max_token,
                        top_p: props.parameters.top_p,
                        top_k: props.parameters.top_k,
                        temperature: props.parameters.temperature,
                        penalty: props.parameters.penalty,
                    })

                default:
                    throw new Error("LLM not found.")
            }

        default:
            throw new Error("LLM reference not found.")
    }
}


/**
 * add routeInferLLMCode function for LLM function calling
 * @param props 
 * @returns 
 */
export async function routeLLMFuncCall(props: LLMInferenceProps): Promise<FuncCallResponse> {
    // get a model
    const model = model_list.function_call.find(e => e.value == props.model);
    if (!model) { throw new Error("LLM not found.") }
    if (!props.messages) { throw new Error("Messages not found.") }
    if (!props.functions) { throw new Error("Functions not found.") }

    // switch by model source
    switch (model.ref) {
        case "TWCC":
            const response = await functionCall({
                model: props.model,
                messages: props.messages,
                parameters: {
                    max_new_tokens: props.parameters.max_token,
                    frequence_penalty: props.parameters.penalty,
                    temperature: props.parameters.temperature,
                    top_k: props.parameters.top_k,
                    top_p: props.parameters.top_p,
                },
                // functions: props.functions.map((func) => ({
                //     name: func.name,
                //     description: func.description,
                //     parameters: {
                //         type: "object",
                //         properties: func.properties.reduce(
                //             (p, e) => {
                //                 return {
                //                     ...p,
                //                     [e.name]: {
                //                         type: e.type,
                //                         description: e.description || null,
                //                         // enum: e.enum || null,
                //                     }
                //                 }
                //             }, {}),
                //         required: func.properties.reduce((arr, e) => {
                //             if (e.required) {
                //                 return [...arr, e.name]
                //             }
                //             return arr
                //         }, [] as string[])
                //     }
                // })),
                tools: props.functions.map((func) => ({
                    type: "function",
                    function: {
                        name: func.name,
                        description: func.description,
                        parameters: {
                            type: "object",
                            properties: func.properties.reduce(
                                (p, e) => {
                                    return {
                                        ...p,
                                        [e.name]: {
                                            type: e.type,
                                            description: e.description || null,
                                            // enum: e.enum || null,
                                        }
                                    }
                                }, {}),
                            required: func.properties.reduce((arr, e) => {
                                if (e.required) {
                                    return [...arr, e.name]
                                }
                                return arr
                            }, [] as string[])
                        }
                    }
                })),
                stream: false
            });

            if (response.tool_calls.length > 0) {
                let func = response.tool_calls.find(e => e.type === "function");
                if (func?.function) {
                    if(typeof func.function.arguments === "string"){
                        func.function.arguments = JSON.parse(func.function.arguments)
                    }
                    console.log(func.function);
                    return func.function;
                }
            }
            throw new Error("Function call response is null.")

        default:
            throw new Error("LLM reference not found.")
    }
}


/**
 * add routeEmbedding function to handle embedding model inference
 * @param model_name 
 * @returns 
 */
export function routeEmbedding(model_name: string): {
    model: string,
    infer: (props: EmbeddingProps) => Promise<{ data: EmbeddingData[] }>
} {
    // get a model
    const model = model_list.embedding.find(e => e.value == model_name);
    if (!model) { throw new Error("Embedding model not found.") }

    // switch by model source
    switch (model.ref) {
        case "TWCC":
            return {
                model: model_name,
                infer: embedding,
            }

        default:
            throw new Error("Embedding model reference not found.")
    }
}