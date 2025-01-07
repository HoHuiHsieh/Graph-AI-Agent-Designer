/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */


export type ReactFlowNode = {
    id: string,
    data: any,
    type: string,
    parentId?: string,
}

export type ReactFlowEdge = {
    id: string,
    type: string,
    source: string,
    target: string,
}

export interface Message {
    role: "user" | "assistant" | "system",
    content: string,
}

export interface ChatRoomMessage extends Message {
    elapsed_time?: number,
    timestamp?: string,
    docs?: string[],
    plan?: string,
    is_valid?: boolean,
}