/**
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import axios, { AxiosInstance } from "axios";


/**
 * 
 */
export default class HttpBase {

    instance: AxiosInstance;

    constructor() {
        const baseUrl = new URL(process.env.TWCC_API_URL as string);
        this.instance = axios.create({
            baseURL: baseUrl.href,
            timeout: 60000,
            headers: {
                "accept": "application/json",
                "X-API-KEY": process.env.TWCC_API_KEY,
                "X-API-HOST": "afs-inference",
                "content-type": "application/json",
            }
        });
    }
}
