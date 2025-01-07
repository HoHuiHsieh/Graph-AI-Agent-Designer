/**
 * 
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { instance } from "./base";

/** */
export interface Option { label: string, value: string, ref: string };
export interface ChatOption extends Option { properties: string[] }
export interface TTSOption extends Option { voice: string };
interface ModelList {
    chat_completion: ChatOption[],
    tool_use: ChatOption[],
    embedding: Option[],
    asr: Option[],
    tts: TTSOption[],
}

/**
 * 
 * @returns 
 */
export async function getModels(): Promise<ModelList> {
    const { data } = await instance.get("/model")
    return data
}

/** */
interface TTSProps {
    model: string,
    input: string,
    voice?: string,
}

/**
 * 
 * @param props 
 * @returns 
 */
export async function tts(props: TTSProps): Promise<string> {
    const { data } = await instance.post("/model/tts", props)
    return data
}

/**
 * 
 * @param model 
 * @param file 
 * @returns 
 */
export async function asr(model: string, file: File): Promise<string> {
    let body = new FormData();
    body.append("file", file);
    body.append("model", model);
    const { data } = await this.instance.post("/model/asr", body, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return data
}