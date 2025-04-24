// This file defines the types used in the LangGraph component
import { BaseMessage } from "@langchain/core/messages";
import { Annotation, messagesStateReducer } from "@langchain/langgraph";


/**
 * This is the main state of the LangGraph component.
 */
export const MainStateAnnotation = Annotation.Root({
    json: Annotation<{ [key: string]: any }>,
    messages: Annotation<BaseMessage[]>({
        reducer: messagesStateReducer,
        default: () => [],
    }),
});

export type MainStateType = typeof MainStateAnnotation.State;