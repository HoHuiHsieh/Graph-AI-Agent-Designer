/**
 * get model list and python runner info.
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { getModels, Option, ChatOption, TTSOption } from "@/api/GetModel";
import {getPythonEnvs} from "@/api/GetPython";


interface OptionData {
    python_env: string[],
    chat_model: ChatOption[],
    tool_model: ChatOption[],
    embd_model: Option[],
    asr_model: Option[],
    tts_model: TTSOption[],
}

/**
 * get model list and python runner info.
 * @returns 
 */
export async function getOptions(): Promise<OptionData> {
    const models = await getModels();
    const envs = await getPythonEnvs();
    return {
        python_env: envs,
        chat_model: models.chat_completion,
        tool_model: models.tool_use,
        embd_model: models.embedding,
        asr_model: models.asr,
        tts_model: models.tts,
    }
}