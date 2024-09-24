/**
 * add GetSpeech class for speech processing
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */

import HttpBase from "./HttpBase";


/**
 * class for speech processing
 */
export default class GetSpeech extends HttpBase {

    path: string = "/app/speech"

    constructor(key?: string, path?: string) {
        super(key, path);
    }

    /**
     * generate text-to-speech response
     * @param props 
     * @returns 
     */
    async tts(text: string): Promise<string> {
        const response = await this.instance.post(`${this.path}/tts`, { text });
        return response.data;
    }

    /**
     * generate speech recognition response
     * @param props 
     * @returns 
     */
    async asr(audio: Buffer): Promise<string> {
        const response = await this.instance.post(`${this.path}/asr`, { audio });
        return response.data;
    }
}
