/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { modelList } from "../API";
import openaiTTS from "../API/openai/audio.speech";


/**
 * 
 * @param model 
 * @param file 
 * @returns 
 */
export async function TTS(model: string, input: string, voice = undefined): Promise<string> {
    // get model
    const TTSModel = modelList.tts.find(e => e.value === model && e.voice === voice);
    if (!TTSModel) { throw new Error("TTS model not found.") }
    if (!input) { throw new Error("TTS text not found.") }
    // switch model
    switch (TTSModel.ref) {
        case "OpenAI":
            const openai_TTS_test = await openaiTTS(model, input, voice);
            return openai_TTS_test

        default:
            throw new Error("TTS model not found.");
    }
}