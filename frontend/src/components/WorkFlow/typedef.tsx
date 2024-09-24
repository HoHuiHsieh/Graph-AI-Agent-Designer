/**
 * data types
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */


export type ChatDialog = {
    role: "user" | "assistant" | "system" | "image" | "video",
    content: string,
    elapsed_time?: number,
    timestamp?: string,
}

export type Message = {
    role: "user" | "assistant" | "system",
    content: string,
}