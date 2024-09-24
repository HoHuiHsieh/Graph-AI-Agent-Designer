/**
 * add GetModel class with chatCompletion and codeCompletion methods
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import HttpBase from "./HttpBase";


type Option = {
    label: string,
    value: string,
    ref: string,
}

export interface ModelList {
    chat: Option[],
    function_call: Option[],
    code_completion: Option[],
    embedding: Option[],
}

interface Parameters {
    max_new_tokens: number,
    frequence_penalty: number,
    temperature: number,
    top_k: number,
    top_p: number,
}

/**
 * class with chatCompletion and codeCompletion methods
 */
export default class GetModel extends HttpBase {

    path: string = "/app/model"

    /**
     * 
     * @param key 
     * @param path 
     */
    constructor(key?: string, path?: string) {
        super(key, path);
    }

    /**
     * get model info
     * @returns 
     */
    async get(): Promise<ModelList> {
        const { data } = await this.instance.get(this.path)
        return data
    }

    /**
     * handle chat completion request
     * @param model 
     * @param messages 
     * @param parameters 
     * @returns 
     */
    async chatCompletion(model: string, messages: { role: "system" | "user" | "assistant", content: string }[], parameters: Parameters): Promise<string> {
        const { data } = await this.instance.post(`${this.path}/chatCompletion`, { model, messages, parameters })
        return data
    }

    /**
     * handle code completion request
     * @param model 
     * @param messages 
     * @param parameters 
     * @returns 
     */
    async codeCompletion(model: string, messages: { role: "system" | "user" | "assistant", content: string }[], parameters: Parameters): Promise<string> {
        const { data } = await this.instance.post(`${this.path}/codeCompletion`, { model, messages, parameters })
        return data
    }

}
