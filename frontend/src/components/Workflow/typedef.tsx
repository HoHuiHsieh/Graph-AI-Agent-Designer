/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { Node, Edge } from "reactflow";


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

export type DiagramData = {
    nodes: Node[],
    edges: Edge[],
}