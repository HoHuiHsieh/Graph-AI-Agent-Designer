/**
 * @author HoHui Hsieh
 */
import { routeInferLLMChat, routeInferLLMCode, model_list } from "../API";
import { LLMInferenceProps } from "../API/typedef";


/**
 * 
 * @returns 
 */
export function getModels() {
    return model_list
}

/**
 * 
 * @param props 
 * @returns 
 */
export async function chatCompletion(props: LLMInferenceProps): Promise<string> {
    return await routeInferLLMChat(props);
}

/**
 * 
 * @param props 
 * @returns 
 */
export async function codeCompletion(props: LLMInferenceProps): Promise<string> {
    return await routeInferLLMCode(props)
}


export { LLMInferenceProps }
