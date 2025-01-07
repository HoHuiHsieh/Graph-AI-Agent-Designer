/**
 * 
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { instance } from "./base";


/**
 * 
 * @returns 
 */
export async function getPythonEnvs(): Promise<string[]> {
    const { data } = await instance.get("/python");
    return data;
}

/**
 * 
 * @param props 
 * @returns 
 */
export async function runPythonCode(props: { env: string, code: string }): Promise<string> {
    const { data } = await instance.post("/python", props);
    return data;
}
