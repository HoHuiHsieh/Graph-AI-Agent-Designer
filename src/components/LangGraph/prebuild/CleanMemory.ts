/**
 * @fileoverview This file contains the function to clear the memory graph by removing messages.
 * 
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { StateGraph, MessagesAnnotation, START, END, type MemorySaver } from "@langchain/langgraph";
import { RemoveMessage } from "@langchain/core/messages";
import { MainStateAnnotation, MainStateType } from "../type";

/**
 * Clear the memory graph
 * @param thread_id 
 * @returns 
 */
export function CleanMemoryGraph(memorySaver?: MemorySaver) {

    function deleteMessages(currentState: MainStateType) {
        const messages = currentState.messages;
        return {
            json: {},
            messages: messages
                .filter(m => m.id !== undefined)
                .map(m => new RemoveMessage({ id: m.id as string }))
        };
    }

    return new StateGraph(MainStateAnnotation)
        .addNode("delete_messages", deleteMessages)
        .addEdge(START, "delete_messages")
        .addEdge("delete_messages", END)
        .compile({ checkpointer: memorySaver })
}

