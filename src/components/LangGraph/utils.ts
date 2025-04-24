/**
 * @fileoverview 
 * 
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */

import { MainStateType } from "./type";
import { HumanMessage, AIMessage } from '@langchain/core/messages';


/**
 * Replaces the placeholders in the given string with the corresponding values from the state.
 * If the placeholder is not found in the state, it will be replaced with an empty string.
 * If the placeholder is a nested object, it will be stringified.
 * 
 * The placeholders can be in the format of {{ $messages }}, {{ $json.nested_keys }} or {{ $( " key " , " any " , " any " ) }}.
 * It also handles nested objects and stringifies them.
 * 
 * The state is expected to have a structure like: 
 * {
 *   messages: [ 
 *     new HumanMessage('Hello'), 
 *     new AIMessage('Hi there!')
 *   ],
 *   json: {
 *     key1: "value1",
 *     key2: { nestedKey: "nestedValue" },
 *     nodeName: { key3: "value3", nestedKey2: { nestedKey3: "nestedValue3" } },
 *   },
 * }
 * 
 * For example:
 * 
 * - Input: "This is {{ $messages[1].text }}."
 * - Output: "This is Hi there!"
 * 
 * - Input: "This is {{ $json.key1 }}."
 * - Output: "This is value1"
 * 
 * - Input: "This is {{ $json.nodeName.nestedKey2.nestedKey3 }}."
 * - Output: "This is nestedValue3"
 * 
 * - Input: "This is {{ $( "nodeName" , "arg2" , "arg3" ) }}."
 * - Output: "This is '{ key3: "value3", nestedKey2: { nestedKey3: "nestedValue3" } }'"
 * 
 * 
 * @param str 
 * @param state 
 * @param nodeName 
 * @returns 
 */
export function replacePlaceholders(
    str: string,
    state: MainStateType,
): string {
    // 1. Replace message placeholders like {{ $messages[1].text }}
    str = str.replace(/\{\{\s*\$messages(\[.*?\])?\.?(\w+)?\s*\}\}/g, (match, index, property) => {
        // If no index is provided, return the stringified messages
        if (!index) {
            return JSON.stringify(state.messages);
        }
        
        // Parse the index from the match
        const idx = parseInt(index.substring(1, index.length - 1));
        
        // Check if the index is valid
        if (isNaN(idx) || idx < 0 || idx >= state.messages.length) {
            return '';
        }
        
        const message = state.messages[idx];
        
        // If property is specified (like .text), return that property
        if (property) {
            if (property === 'text' && (message instanceof HumanMessage || message instanceof AIMessage)) {
                return typeof message.content === 'string' ? message.content : JSON.stringify(message.content);
            }
            return message[property] || '';
        }
        
        // Otherwise return the stringified message
        return JSON.stringify(message);
    });
    
    // 2. Replace json placeholders like {{ $json.key1 }} or {{ $json.nodeName.nestedKey2.nestedKey3 }}
    str = str.replace(/\{\{\s*\$json\.([^\s\}]+)\s*\}\}/g, (match, path) => {
        // Split the path by dots
        const keys = path.split('.');
        
        // Traverse the object using the keys
        let value = state.json;
        for (const key of keys) {
            if (value === undefined || value === null) {
                return '';
            }
            value = value[key];
        }
        
        // If the value is an object, stringify it
        if (typeof value === 'object' && value !== null) {
            return JSON.stringify(value);
        }
        
        // Return the value or empty string if not found
        return value !== undefined ? String(value) : '';
    });
    
    // 3. Replace function-like placeholders {{ $( "nodeName" , "arg2" , "arg3" ) }}
    str = str.replace(/\{\{\s*\$\(\s*"([^"]+)"\s*(?:,\s*"([^"]+)"\s*)*\)\s*\}\}/g, (match) => {
        // Parse the function call to extract nodeName
        const nodeNameMatch = match.match(/\{\{\s*\$\(\s*"([^"]+)"/);
        if (!nodeNameMatch) return '';
        
        const nodeName = nodeNameMatch[1];
        
        // Get the node value from state.json
        const nodeValue = state.json[nodeName];
        
        if (nodeValue === undefined) {
            return '';
        }
        
        // Return the stringified node value
        return JSON.stringify(nodeValue);
    });
    
    return str;
}
