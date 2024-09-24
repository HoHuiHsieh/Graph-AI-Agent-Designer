/**
 * get model list and python runner info.
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import GetModel from "@/api/GetModel";
import GetPython from "@/api/GetPython";
import { ModelList } from "@/api/GetModel";


export interface OptionsData {
    models: ModelList,
    envs: string[]
}

const getModel = new GetModel();
const getPython = new GetPython();

/**
 * get model list and python runner info.
 * @returns 
 */
export async function getOptions(): Promise<OptionsData> {
    const models = await getModel.get();
    const envs = await getPython.get();
    return { models, envs }
}