/**
 * @author HoHui Hsieh
 */
import { asr, tts } from "../API/triton";


/**
 * 
 * @param text 
 * @returns 
 */
export function applyTTS(text: string) {
    return tts.inference({ text })
}


/**
 * 
 * @param dataurl 
 * @returns 
 */
export function applyASR(data_string: string) {
    let audio = Buffer.from(data_string);
    return asr.inference({ audio })
}
