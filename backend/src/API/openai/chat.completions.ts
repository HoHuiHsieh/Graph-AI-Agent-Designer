/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import {
    ChatCompletionAssistantMessageParam,
    ChatCompletionUserMessageParam,
    ChatCompletionDeveloperMessageParam,
    ChatCompletionTool,
    ChatCompletionCreateParamsStreaming,
    ChatCompletionCreateParamsNonStreaming
} from "openai/resources"
import { openai } from "./connection"


export interface ChatCompletionProps {
    model: string,
    messages: {
        role: "user" | "assistant" | "system" | "developer",
        content: string,
    }[],
    tools?: {
        type: string,
        function: {
            name: string,
            description: string,
            parameters: {
                type: string,
                properties: {
                    [name: string]: {
                        type: string,
                        description: string
                    }
                },
                required: string[],
                additionalProperties: boolean,
            },
        }
    }[],
    max_completion_tokens?: number,
    temperature?: number,   // 0~1
    top_p?: number, // 0~1
    frequency_penalty?: number, // -2~2
    presence_penalty?: number,  // -2~2
    stream?: boolean
}

type OpenAIMessages = (ChatCompletionDeveloperMessageParam | ChatCompletionAssistantMessageParam | ChatCompletionUserMessageParam)[];

/**
 * 
 * @param props 
 * @returns 
 */
export default function ChatCompletion(props: ChatCompletionProps, callback?: (txt: string) => void): Promise<ChatCompletionAssistantMessageParam | void> {
    // convert messages
    const openaiMessages: OpenAIMessages = props.messages.map(e => {
        switch (e.role) {
            case "user":
                return { role: "user", content: e.content };
            case "assistant":
                return { role: "assistant", content: e.content };
            case "system":
                return { role: "developer", content: e.content };
            case "developer":
                return { role: "developer", content: e.content };
            default:
                throw new Error("Failed to parse Messages.")
        }
    })

    // convert tools
    let openaiTools;
    if (props.tools) {
        openaiTools = props.tools.map(e => {
            if (e.type === "function") {
                return {
                    ...e,
                    function: {
                        ...e.function,
                        strict: true,
                        additionalProperties: false,
                    }
                }
            }
            return e
        }) as ChatCompletionTool[];
    }
    else { openaiTools = undefined; }
    // 
    const properties = {
        model: props.model,
        messages: openaiMessages,
        tools: openaiTools,
        temperature: props?.temperature,
        top_p: props?.top_p,
        frequency_penalty: props?.frequency_penalty,
        presence_penalty: props?.presence_penalty,
    }
    // stream mode
    if (props?.stream) {
        if (!callback) {
            throw new Error("Callback is required in stream mode.")
        }
        return runStreamMode({ ...properties, stream: true }, callback)
    }
    // event mode
    return runEventMode({ ...properties, stream: false })
}

/**
 * 
 * @param properties 
 * @param callback 
 * @returns 
 */
async function runStreamMode(properties: ChatCompletionCreateParamsStreaming, callback: (txt: string) => void) {
    const completion = await openai.chat.completions.create(properties);
    for await (const chunk of completion) {
        callback(chunk.choices[0]?.delta?.content || "");
    }
}

/**
 * 
 * @param properties 
 * @returns 
 */
async function runEventMode(properties: ChatCompletionCreateParamsNonStreaming) {
    const completion = await openai.chat.completions.create(properties);
    return completion.choices[0].message
}


// OpenAI model list (2025.1.2)
// https://platform.openai.com/docs/models#model-endpoint-compatibility
const properties = ["model", "messages", "max_completion_tokens", "temperature", "top_p", "frequency_penalty", "presence_penalty"]
export const models = [
    { label: "GPT-4o", value: "gpt-4o", ref: "OpenAI", properties },
    { label: "GPT-4o mini", value: "gpt-4o-mini", ref: "OpenAI", properties },
    { label: "GPT-4", value: "gpt-4", ref: "OpenAI", properties },
    { label: "GPT-3.5 Turbo", value: "gpt-3.5-turbo", ref: "OpenAI", properties },
];