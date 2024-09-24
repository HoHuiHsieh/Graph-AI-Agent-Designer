/**
 * @author HoHui Hsieh
 */
import HttpBase from "./http";
import { TWCCLLMRequestBody, TWCCLLMResponseData, TWCCEmbdRequestBody, TWCCEmbdResponseData } from "./typedef";



/**
 * 
 * @param data 
 * @returns 
 */
async function chatCompletion(body: TWCCLLMRequestBody): Promise<TWCCLLMResponseData> {
    const connection = new HttpBase();
    const response = await connection.instance.post("/models/conversation", body)
    const { data } = response;
    return data
}


/**
 * 
 * @param data 
 * @returns 
 */
async function functionCall(body: TWCCLLMRequestBody): Promise<TWCCLLMResponseData> {
    const connection = new HttpBase();
    const response = await connection.instance.post("/models/conversation", body);
    const { data } = response;
    return data
}


/**
 * 
 * @param data 
 * @returns 
 */
async function embedding(body: TWCCEmbdRequestBody): Promise<TWCCEmbdResponseData> {
    const connection = new HttpBase();
    const response = await connection.instance.post("/models/embeddings", body)
    const { data } = response;
    return data
}

export { chatCompletion, functionCall, embedding }