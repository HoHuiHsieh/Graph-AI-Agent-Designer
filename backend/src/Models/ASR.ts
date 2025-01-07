/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { modelList } from "../API";
import openaiASR from "../API/openai/audio.transcriptions";


/**
 * 
 * @param model 
 * @param file 
 * @returns 
 */
export async function ASR(model: string, file: File): Promise<string> {
    // get model
    const asrModel = modelList.chat_completion.find(e => e.value === model);
    if (!asrModel) { throw new Error("ASR model not found.") }
    if (!file) { throw new Error("Audio file not found.") }
    // switch model
    switch (asrModel.ref) {
        case "OpenAI":
            const openai_asr_test = await openaiASR(model, file);
            return openai_asr_test

        default:
            throw new Error("ASR model not found.");
    }
}