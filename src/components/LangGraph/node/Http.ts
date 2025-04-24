/**
 * @fileoverview Handles HTTP requests and updates the application state with the response.
 * 
 * @author Hsieh
 */
import { DATA_TYPES, HTTPNodeDataType } from "../../../types/nodes";
import { MainStateType } from "../type";
import { handleHandoffs } from "./handoff";
import { CredentialType } from "../../../types/credential";
import { AIMessage, ToolMessage } from "@langchain/core/messages";

/**
 * Constructs the request URL, appending query parameters if applicable.
 */
function constructRequestUrl(url: string, method: string, params?: Record<string, string>): string {
    return method === "GET" && params
        ? `${url}?${new URLSearchParams(params).toString()}`
        : url;
}

/**
 * Parses the HTTP response and ensures it is valid JSON.
 */
async function parseResponse(response: Response): Promise<any> {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
    }
    try {
        return await response.json();
    } catch {
        throw new Error("Failed to parse response as JSON.");
    }
}

/**
 * Safely parses a JSON string, returning the original string if parsing fails.
 */
function tryParseJson(value: string): string {
    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
}

/**
 * Executes an HTTP request and updates the application state with the response.
 */
export function HttpNode(data: HTTPNodeDataType, credentials: CredentialType) {
    const { name, type, handoffs, url, method, headers, body, params } = data;

    // Validate the type of the node
    if (type !== DATA_TYPES.HTTP) {
        throw new Error(`Invalid agent type: expected "${DATA_TYPES.HTTP}", received "${type}"`);
    }

    return async (currentState: MainStateType) => {
        // Validate the node type
        if (type !== "http") {
            throw new Error(`Invalid node type: expected "http", received "${type}"`);
        }

        let updatedState: MainStateType;
        let responseResult: any;

        try {
            // Prepare request options
            const requestOptions: RequestInit = {
                method,
                headers: {
                    ...headers,
                    "Content-Type": "application/json",
                },
                ...(body && ["POST", "PUT", "DELETE"].includes(method) && { body: JSON.stringify(body) }),
            };

            // Construct the request URL
            const requestUrl = constructRequestUrl(url, method, params);

            // Execute the HTTP request
            const response = await fetch(requestUrl, requestOptions);

            // Parse the response
            responseResult = await parseResponse(response);
        } catch (error) {
            throw new Error(`Error executing HTTP request: ${error.message}`);
        }

        // Update the application state with the response data
        const tool_call_id = crypto.randomUUID();
        const resContent = typeof responseResult === "string" ? tryParseJson(responseResult) : `${responseResult}`;
        updatedState = {
            messages: [
                ...currentState.messages,
                new AIMessage({
                    content: "Sending HTTP request...",
                    tool_calls: [{
                        id: tool_call_id,
                        name,
                        args: {
                            url, 
                            method, 
                            headers, 
                            body, 
                            params
                        }
                    }]
                }),
                new ToolMessage({
                    tool_call_id: tool_call_id,
                    content: resContent,
                })
            ],
            json: {
                ...currentState.json,
                [name]: resContent,
            },
        };

        // Return the updated state if no conditions are met
        return handleHandoffs(handoffs, name, updatedState, credentials)
    };
}