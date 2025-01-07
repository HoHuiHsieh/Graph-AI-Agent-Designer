/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import SessionManager from "./Session";


const manager = new SessionManager();

/**
 * 
 * @param uploaded 
 * @returns 
 */
export function uploadFile(file: File): Promise<string> {
    if (!file) { throw new Error("'file' is required.") }
    return manager.upload(file)
}

/**
 * 
 * @param checksum 
 * @param prompt 
 * @returns 
 */
export function retrieve(checksum: string, prompt: string): Promise<string[]> {
    if (!checksum) { throw new Error("'checksum' is required.") };
    if (!prompt) { throw new Error("'prompt' is required.") };
    return manager.retrieve(checksum, prompt)
}