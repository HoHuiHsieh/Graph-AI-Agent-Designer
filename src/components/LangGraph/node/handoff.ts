/**
 * @fileoverview 
 * 
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { Command } from "@langchain/langgraph";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { replacePlaceholders } from "../utils";
import { BaseHandoffType } from "../../../types/nodes";
import { MainStateType } from "../type";
import { CredentialType } from "../../../types/credential";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";

// Add a lock to prevent concurrent updates
let isProcessing = false;

/**
 * Handles the handoffs of a node.
 * It evaluates the handoffs and returns the updated state.
 * If a handoff condition is met, it returns a command to go to the specified node.
 * If no valid handoff is found, it throws an error.
 * @param handoffs 
 * @param name 
 * @param state 
 * @returns 
 */
export async function handleHandoffs(handoffs: BaseHandoffType, name: string, state: MainStateType, credentials: CredentialType) {
    if (isProcessing) {
        throw new Error("Concurrent updates are not allowed. Please wait for the current process to complete.");
    }
    isProcessing = true; // Acquire the lock

    try {
        const updatedState = { ...state }; // Initialize updatedState with the provided state

        // if handoffs include 0 or 1 item, return the updated state
        if (handoffs.items.length <= 1) {
            return updatedState;
        }

        // if use AI decision, define model to invoke
        if (handoffs.useAi) {
            const { model, credName, items } = handoffs;
            const nameList = items.map((item) => item.name);

            // Build the inference model based on the provided configuration
            let openAiCredential = credentials.openai.find((cred) => cred.credName === credName);
            if (!openAiCredential) {
                throw new Error(`Credential not found for model ${model}`);
            }
            const inferModel = new ChatOpenAI({
                model: model,
                apiKey: openAiCredential.apiKey,
                configuration: {
                    baseURL: openAiCredential.baseUrl,
                },
            }).bindTools([
                tool(() => "selectTarget", {
                    name: "selectTarget",
                    description: "Invoke this tool to select a sub-flow.",
                    schema: z.object({
                        target: z.enum(nameList as [string, ...string[]]).describe("Sub-flow name"),
                    }),
                })
            ]);

            // Prepare the input messages for the model
            const inputMessages = [
                ...state.messages,
                new HumanMessage(`
                Select a sub-flow by using the tool that helps you generate the best response.
                If none are needed, go to the end.
                `),
            ];

            // Invoke the model with the input messages
            const result = await inferModel.invoke(inputMessages);

            // Check if the result contains a valid tool call
            if (result.tool_calls && result.tool_calls.length > 0) {
                // Extract the target name from the tool call
                const targetName = result.tool_calls[0].args.target;
                console.log(`\nTarget name: ${targetName}\n`);

                // return the updated state with the target handoff
                return new Command({
                    goto: targetName,
                    update: updatedState
                });
            }
            throw new Error(`No valid handoff found for node ${name}`);
        }

        // use expression to evaluate the handoffs
        for (const h of handoffs.items) {
            const { name: targetName, express: code } = h;
            const updatedCode = replacePlaceholders(code, updatedState);

            // Execute the JavaScript code
            let result: unknown;
            try {
                // Execute the JavaScript code
                const func = new Function(updatedCode);
                result = await func();
            } catch (executionError: unknown) {
                const errorMessage = executionError instanceof Error
                    ? executionError.message
                    : String(executionError);

                throw new Error(`Error executing JavaScript code: ${errorMessage}`);
            }

            // if the expression is true, return the updated state
            if (result) {
                return new Command({
                    goto: targetName,
                    update: updatedState
                });
            }
            // if the expression is false, continue to the next handoff
        }

        // if no valid handoff found, throw an error
        throw new Error(`No valid handoff found for node ${name}`);
    } finally {
        isProcessing = false; // Release the lock
    }
}