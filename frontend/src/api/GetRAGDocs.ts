/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { instance } from "./base";


/**
 * 
 * @param file 
 * @returns 
 */
export async function uploadFile(file: File): Promise<string> {
    let body = new FormData();
    body.append("file", file)
    let { data } = await instance.post("/doc/upload", body, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return data;
}
