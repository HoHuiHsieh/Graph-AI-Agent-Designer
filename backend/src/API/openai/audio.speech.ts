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
export default async function TTS(
    model: string,
    input: string,
    voice: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer" | undefined = "alloy",
): Promise<string> {
    const wav = await openai.audio.speech.create({
        model: model,
        voice: voice,
        input: input,
        response_format: "wav",
    });
    const buffer = Buffer.from(await wav.arrayBuffer());
    const base64String = buffer.toString("base64");
    return "data:audio/wav;base64," + base64String
}

/** */
export const models = [
    { label: "tts-1 (Alloy)", value: "tts-1", voice: "alloy", ref: "OpenAI", },
    { label: "tts-1 (Echo)", value: "tts-1", voice: "echo", ref: "OpenAI", },
    { label: "tts-1 (Fable)", value: "tts-1", voice: "fable", ref: "OpenAI", },
    { label: "tts-1 (Onyx)", value: "tts-1", voice: "onyx", ref: "OpenAI", },
    { label: "tts-1 (Nova)", value: "tts-1", voice: "nova", ref: "OpenAI", },
    { label: "tts-1 (Shimmer)", value: "tts-1", voice: "shimmer", ref: "OpenAI", },
]