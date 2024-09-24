/**
 * interfaces and types
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */

export type Message = {
    role: "user" | "assistant" | "system",
    content: string,
    elapsed_time?: number,
    timestamp?: string,
}

export interface ChatSession {
    system?: Message[],
    instruction?: Message[],
    prompt?: Message[],
    assistant?: Message[],
    function?: {
        name: string,
        arguments: { [key: string]: any }
    },
}


