/**
 * @fileoverview 
 * 
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { MainStateType } from "./type";


/**
 * Execute JS code within the placeholders in the given string with state inputs.
 * 
 * The placeholders can be in the format of {{ ... JS code ... }}.
 * 
 * The JS code can access the state inputs with the format of $json , $messages or $( "key" , "arg2" , "arg3" ), where:
 * - $json = state.json
 * - $json.key1 = state.json.key1
 * - $json.key2.nestedKey = state.json.key2.nestedKey
 * - $messages = state.messages
 * - $messages[0] = state.messages[0]
 * - $messages[0].text = state.messages[0].text
 * - $( "key" , "arg2" , "arg3" ) = state.json[nodeName].key
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
 *     key4: [item1, item2],
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
 * - Input: "This is {{ $json.key4.map((e)=>{ return `value-${e}`}).join(', ') }}."
 * - Output: "This is value-item1, value-item2."
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
    return (str || "").replace(/{{(.*?)}}/g, (match, jsCode) => {
        try {
            const $json = state.json;
            const $messages = state.messages;
            const $ = (key: string, ...args: string[]) => {
                if ($json && $json[key]) {
                    // return JSON.stringify($json[key]);
                    return $json[key];
                }
                return 'undefined'; // Return 'undefined' when key doesn't exist
            };
            
            const result = eval(jsCode.trim());
            
            // Return 'undefined' when values are undefined or null
            if (result === undefined || result === null) {
                return 'undefined';
            }
            
            // Handle the case where the result is an object that needs to be stringified
            if (typeof result === 'object') {
                // Special handling for arrays - join them without brackets
                if (Array.isArray(result)) {
                    return result.join(',');
                }
                return JSON.stringify(result);
            }
            
            return result;
        } catch (error) {
            // Return error for all errors instead of returning the placeholder
            return `{Error: ${error.message}}`;
        }
    });
}
