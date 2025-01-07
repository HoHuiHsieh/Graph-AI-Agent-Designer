/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { modelList } from "../API";
import OpenAIChatCompletion, { ChatCompletionProps as OpenAIChatCompletionProps } from "../API/openai/chat.completions";


export interface ChatCompletionRequest {
    model: string,
    messages: {
        role: "user" | "assistant" | "system",
        content: string,
    }[],
    parameters: {
        max_completion_tokens: number,
        min_length?: number,
        temperature?: number,
        top_k?: number,
        top_p?: number,
        length_penalty?: number,
        repetition_penalty?: number,
        presence_penalty?: number,
        frequency_penalty?: number,
    },
    functions?: {
        name: string,
        description: string,
        properties: {
            name: string,
            type: string,
            description?: string,
            required: boolean,
        }[]
    }[],
}

/**
 * 
 * @param props 
 * @returns 
 */
export async function ChatCompletion(props: ChatCompletionRequest): Promise<string> {
    // get model
    const model = modelList.chat_completion.find(e => e.value === props?.model);
    if (!model) { throw new Error("Model not found.") }
    if (!props?.messages) { throw new Error("Messages not found.") }
    // switch model
    switch (model.ref) {
        case "OpenAI":
            const OpenAIResponse = await requestOpenAI(props);
            if (typeof OpenAIResponse?.content === "string") {
                console.log(OpenAIResponse.content);
                return OpenAIResponse.content
            }
            throw new Error("OpenAI ChatCompletion response error.");

        default:
            throw new Error("Model reference not found.");
    }
}


export interface ToolUseResponse {
    name: string,
    arguments: { [name: string]: any }
}

/**
 * 
 * @param props 
 * @returns 
 */
export async function ToolUse(props: ChatCompletionRequest): Promise<ToolUseResponse> {
    // get model
    const model = modelList.chat_completion.find(e => e.value === props?.model);
    if (!model) { throw new Error("Model not found.") }
    if (!props?.messages) { throw new Error("Messages not found.") }
    // switch model
    switch (model.ref) {
        case "OpenAI":
            const OpenAIResponse = await requestOpenAI(props);
            if (OpenAIResponse?.tool_calls) {
                const func = OpenAIResponse.tool_calls.find(e => e.type === "function");
                if (func) {
                    console.log(func.function);
                    return {
                        name: func.function.name,
                        arguments: JSON.parse(func.function.arguments)
                    }
                }
            }
            throw new Error("OpenAI ToolUse response error.");

        default:
            throw new Error("Model reference not found.");
    }
}




/**
 * 
 * @param props 
 * @returns 
 */
async function requestOpenAI(props: ChatCompletionRequest) {
    let OpenAItools: OpenAIChatCompletionProps["tools"];
    if (Array.isArray(props?.functions)) {
        OpenAItools = props.functions.map((func) => {
            const properties = (func?.properties || []);
            // const required = properties.reduce((arr, e) => {
            //     if (e.required) {
            //         return [...arr, e.name]
            //     }
            //     return arr
            // }, [] as string[]);
            const required = properties.map(e => e.name);
            const parameters = {
                type: "object",
                properties: properties.reduce((p, e) => ({
                    ...p,
                    [e.name]: {
                        type: e.type,
                        description: e.description || null,
                    }
                }), {}),
                required: required,
                strict: true,
                additionalProperties: false,
            }
            return {
                type: "function",
                function: {
                    name: func.name,
                    description: func.description,
                    parameters: parameters,
                }
            }
        })
    }
    const OpenAIResponse = await OpenAIChatCompletion({
        model: props.model,
        messages: props.messages,
        tools: OpenAItools,
        max_completion_tokens: props.parameters?.max_completion_tokens,
        temperature: props.parameters?.temperature,
        top_p: props.parameters?.top_p,
        frequency_penalty: props.parameters?.frequency_penalty,
        presence_penalty: props.parameters?.presence_penalty,
        stream: false
    })
    return OpenAIResponse
}