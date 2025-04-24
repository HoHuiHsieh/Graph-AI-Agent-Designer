/**
 * @fileoverview 
 * Handles execution of JavaScript code and updates the state with the result.
 * 
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { CodeToolDataType, DATA_TYPES } from "../../../types/nodes";
import { MainStateType } from "../type";
import { handleHandoffs } from "./handoff";
import { replacePlaceholders } from "../utils";
import { CredentialType } from "../../../types/credential";
import { AIMessage, ToolMessage } from "@langchain/core/messages";


/**
 * Executes JavaScript code and updates the state with the result.
 * 
 * @param currentState The current state of the application.
 * @param data The code data containing the code, name, and type.
 * @returns The updated state.
 * @throws Will throw an error if the code type is not "javascript" or if the result is invalid.
 */
export function JavaScriptNode(data: CodeToolDataType, credentials: CredentialType) {
    const { name, type, code, handoffs } = data;

    // Validate the type of the node
    if (type !== DATA_TYPES.JAVASCRIPT) {
        throw new Error(`Invalid agent type: expected "${DATA_TYPES.JAVASCRIPT}", received "${type}"`);
    }

    return async (currentState: MainStateType) => {
        // Validate the code type
        if (type !== "javascript") {
            throw new Error(`Invalid code type: expected "javascript", received "${type}"`);
        }

        // Replace placeholders in the code with values from the current state
        // This allows dynamic code execution based on the current state
        const updatedCode = replacePlaceholders(code, currentState);

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
            result = `Error executing JavaScript code: ${errorMessage}`;
        }

        // Create updated state with result
        let jsonData = {...currentState.json}

        // Process the result and update the state
        if (typeof result === "string") {
            try {
                // Try to parse string as JSON
                jsonData = {
                    ...jsonData,
                    [name]: JSON.parse(result),
                };
            } catch (parseError: unknown) {
                // Store as string if not valid JSON
                jsonData = {
                    ...jsonData,
                    [name]: result,
                };
            }
        } else if (result !== null && (typeof result === "object" || Array.isArray(result))) {
            // Store objects and arrays directly
            jsonData = {
                ...jsonData,
                [name]: result,
            };
        } else {
            // Handle invalid results
            jsonData = {
                ...jsonData,
                [name]: "The result is not a valid JSON, object, or array. Please check the code.",
            };
        }

        // Update the application state with the response data
        const tool_call_id = crypto.randomUUID();
        const updatedState = {
            messages: [
                ...currentState.messages,
                new AIMessage({
                    content: "Executeing JavaScript code...",
                    tool_calls: [{
                        id: tool_call_id,
                        name,
                        args: {
                            code: updatedCode
                        }
                    }]
                }),
                new ToolMessage({
                    tool_call_id: tool_call_id,
                    content: jsonData[name] || "No result returned from the code execution.",
                })
            ],
            json: jsonData,
        };

        return handleHandoffs(handoffs, name, updatedState, credentials);
    };
}
