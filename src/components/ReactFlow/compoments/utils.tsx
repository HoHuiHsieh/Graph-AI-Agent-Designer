/**
 * @fileoverview Utility functions for handling inline arguments, JSON parsing, and other utilities.
 * 
 * @author Hsieh
 */
import { getOutgoers, Node, Edge } from "reactflow";
import { ArgumentsType, BaseAIHandoffItemType, BaseExpressHandoffItemType } from "../../../types/nodes";
import { NODE_TYPES } from "../../../types/nodes";


/**
 * Extract inline arguments from a string using a regex pattern.
 * @param str - The input string containing inline arguments.
 * @returns A ArgumentsType object with extracted arguments.
 */
export function getInlineArgumentsFromString(str: string): ArgumentsType {
    const regex = /\{\{\s*\$\s*\(\s*["']([^"']+)["']\s*,\s*["']([^"']+)["']\s*,\s*["']([^"']+)["']\s*\)\s*\}\}/g;
    const result: ArgumentsType = {};
    let match;

    while ((match = regex.exec(str)) !== null) {
        const [_, name, type, description] = match;
        if (name && type && description) {
            result[name] = { type, description };
        }
    }

    return result;
}

/**
 * Validate if a string contains properly formatted inline arguments.
 * @param str - The input string to validate.
 * @returns True if the string contains valid inline arguments, otherwise false.
 */
export function checkInlineArguments(str: string): boolean {
    const regex = /\{\{\s*\$\s*\(\s*["']([^"']+)["']\s*,\s*["']([^"']+)["']\s*,\s*["']([^"']+)["']\s*\)\s*\}\}/g;

    return [...str.matchAll(regex)].every((match) => {
        const [_, name, type, description] = match;
        return !!(name && type && description);
    });
}

/**
 * Determine if a string is a valid JSON string.
 * @param str - The input string to check.
 * @returns True if the string is valid JSON, otherwise false.
 */
export function checkIsJson(str: string): boolean {
    if (typeof str !== "string") return false;

    try {
        JSON.parse(str);
        return true;
    } catch {
        return false;
    }
}

/**
 * Parse a JSON string and escape special characters before parsing.
 * @param str - The input JSON string.
 * @returns The parsed JSON object or null if parsing fails.
 */
export function parseJsonString(str: string): any {
    if (typeof str !== "string") return str;

    try {
        const escapedStr = str
            .replace(/\\n/g, "\\\\n")
            .replace(/\\r/g, "\\\\r")
            .replace(/\\t/g, "\\\\t")
            .replace(/\\b/g, "\\\\b")
            .replace(/\\f/g, "\\\\f")
            .replace(/\\"/g, "\\\\\"")
            .replace(/\\\\/g, "\\\\\\\\");
        return JSON.parse(escapedStr);
    } catch (e) {
        console.error("Failed to parse JSON string:", e);
        return null;
    }
}

/**
 * Build a URL by combining a base URL and a path.
 * @param baseUrl - The base URL.
 * @param path - The path to append.
 * @returns The combined URL.
 */
export function buildUrl(baseUrl: string, path: string): string {
    const trimmedBaseUrl = baseUrl.replace(/\/+$/, ""); // Remove trailing slashes
    const trimmedPath = path.replace(/^\/+/, ""); // Remove leading slashes
    return `${trimmedBaseUrl}/${trimmedPath}`;
}

/**
 * Updates handoffs based on outgoing node names.
 * @param node - The current node being updated.
 * @param nodes - All nodes in the ReactFlow instance.
 * @param edges - All edges in the ReactFlow instance.
 * @param handoffs - Existing handoffs for the node.
 * @returns Updated handoffs array.
 */
export function updateHandoffs(
    node: Node,
    nodes: Node[],
    edges: Edge[],
    handoffs: BaseAIHandoffItemType[] | BaseExpressHandoffItemType[] | undefined
): BaseAIHandoffItemType[] | BaseExpressHandoffItemType[] | undefined {
    const outgoers = getOutgoers(node, nodes, edges)
        .filter((outgoer) => [NODE_TYPES.AGENT, NODE_TYPES.DEFAULT, NODE_TYPES.FLOWPOINT].includes(outgoer.type))
        .map((outgoer) => outgoer.data.name);

    if (outgoers.length === 0) return undefined;

    return outgoers.map((name) => {
        const condition = handoffs?.find((cond) => cond.name === name);
        return {
            description: "",
            expression: "",
            ...condition,
            name,
        };
    });
}

/**
 * Fetch the list of models from the API.
 * @param apiKey - The API key for authentication.
 * @param baseURL - The base URL of the API.
 * @returns A promise resolving to an array of model IDs or undefined if an error occurs.
 */
export async function fetchModelList(apiKey: string, baseURL: string): Promise<string[] | undefined> {
    // Check if the API key and base URL are provided
    if (!apiKey || !baseURL) return;

    // Construct the URL for the API request
    const url = buildUrl(baseURL, "/models");

    try {
        // Make the API request to fetch the model list
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
        });
        // Check if the response is ok (status code 200-299)
        if (!response.ok) {
            console.error(`Error fetching model list: ${response.statusText}`);
            return;
        }
        // Parse the response JSON and extract the model IDs
        const data = await response.json();
        return data?.data?.map((model: { id: string }) => model.id) || [];

    } catch (error) {
        console.error("Failed to fetch model list:", error);
        return;
    }
}