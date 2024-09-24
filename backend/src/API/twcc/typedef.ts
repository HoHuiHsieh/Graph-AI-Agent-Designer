/**
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */

// define output data types
export interface TWCCMessage {
    role: "user" | "assistant" | "system",
    content: string,
    elapsed_time?: number,
}

export interface TWCCLLMRequestBody {
    model: string,
    messages: TWCCMessage[],
    tools?: {
        type: string,
        function: {
            name: string,
            description: string,
            parameters?: {
                type: string,
                properties: {
                    [name: string]: {
                        type: string,
                        enum?: string[],
                        description?: string,
                    }
                },
                required: string[]
            }
        }
    }[],
    functions?: {
        name: string,
        description: string,
        parameters?: {
            type: string,
            properties: {
                [name: string]: {
                    type: string,
                    enum?: string[],
                    description?: string,
                }
            },
            required: string[]
        }
    }[],
    parameters: {
        max_new_tokens: number,
        frequence_penalty: number,
        temperature: number,
        top_k: number,
        top_p: number,
    },
    stream: boolean
}

export type TWCCLLMResponseData = {
    generated_text: string,
    function_call?: {
        name: string,
        arguments: {
            [arg: string]: string,
        }
    },
    tool_calls: {
        type: "function",
        id: string,
        function: {
            name: string,
            arguments: {
                [arg: string]: string,
            }
        }
    }[],
}


export interface TWCCEmbdRequestBody {
    model: string,
    inputs: string[]
}


export type TWCCEmbdResponseData = {
    data: {
        embedding: number[],
        index: number,
        object: string,
    }[],
}

