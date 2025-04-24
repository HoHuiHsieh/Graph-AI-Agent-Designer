/**
 * @fileoverview 
 * This file defines the `SubflowNode` function, which acts as a wrapper for invoking a compiled state graph workflow.
 * It processes the input state, invokes the workflow, and returns the updated state.
 * 
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { BaseNodeDataType, DATA_TYPES } from "../../../types/nodes";
import { MainStateType } from "../type";
import { CompiledStateGraph } from "@langchain/langgraph";
import { handleHandoffs } from "./handoff";
import { CredentialType } from "../../../types/credential";

/**
 * Creates a node function to execute a subflow (compiled workflow) within the main workflow.
 * 
 * @param workflow - The compiled state graph workflow to be invoked
 * @returns A function that processes the input state, invokes the workflow, and returns the updated state
 */
export function SubflowNode(data: BaseNodeDataType<{}>, workflow: CompiledStateGraph<any, any>, credentials: CredentialType) {
    const { name, type, handoffs } = data;

    // check type
    if (type !== DATA_TYPES.SUBFLOW) {
        throw new Error(`Invalid agent type: expected "${DATA_TYPES.SUBFLOW}", received "${type}"`);
    }

    return async (currentState: MainStateType) => {
        // Invoke the workflow and get the output
        const workflowOutput = await workflow.invoke(currentState);

        // Return the updated state
        const updatedState = {
            ...currentState,
            messages: workflowOutput.messages,
            json: workflowOutput.json,
        };

        // Process handoffs if any
        return handleHandoffs(handoffs, name, updatedState, credentials)
    };
}