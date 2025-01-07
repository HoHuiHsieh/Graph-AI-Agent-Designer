/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { modelList } from "../API";
import { ChatCompletion, ToolUse } from "./ChatCompletion";
import { Embedding } from "./Embedding";
import { ASR } from "./ASR";
import { TTS } from "./TTS";


/**
 * 
 * @returns 
 */
export function getModels() {
    return modelList
}

export {
    ChatCompletion,
    ToolUse,
    Embedding,
    ASR,
    TTS,
}