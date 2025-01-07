/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import OpenAI from "openai";


const openai = new OpenAI();

/**
 * 
 * @param props 
 * @returns 
 */
export default async function ASR(model: string, file: File,): Promise<string> {
    const text = await openai.audio.transcriptions.create({
        model: model,
        file: file,
        response_format: "text",
    });
    return text
}

/** */
export const models = [
    { label: "Whisper", value: "whisper-1", ref: "OpenAI", },
]