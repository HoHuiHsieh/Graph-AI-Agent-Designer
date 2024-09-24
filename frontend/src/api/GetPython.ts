/**
 * add GetPython class to run python code through api
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import HttpBase from "./HttpBase";


type QueryProps = {
    code: string,
    env: string,
    description: string,
}

/**
 * class to run python code through api
 */
export default class GetPython extends HttpBase {

    path: string = "/app/python"

    constructor(key?: string, path?: string) {
        super(key, path);
    }

    /**
     * handle run python code request
     * @param props 
     * @returns 
     */
    async query(props: QueryProps): Promise<string> {
        const { data } = await this.instance.post(this.path, props);
        return data;
    }

    /**
     * get python runner info
     * @returns 
     */
    async get(): Promise<string[]> {
        let { data } = await this.instance.get(this.path);
        return data as string[]
    }

}
