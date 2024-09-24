/**
 * add HttpBase class for handling HTTP requests with axios
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import axios, { AxiosInstance } from "axios";


/**
 * class for handling HTTP requests with axios
 */
export default class HttpBase {

    path: string = "/";
    access_token: string = process.env.ACCESS_TOKEN || "";
    instance: AxiosInstance;

    /**
     * 
     * @param key 
     * @param path 
     * @param port 
     */
    constructor(key?: string, path?: string) {
        if (key) { this.access_token = key }
        if (path) { this.path = path }
        this.instance = axios.create({
            baseURL: "/",
            timeout: 60000,
            headers: {
                "Authorization": this.access_token,
                "Content-Type": "application/json",
            }
        });
    }

}
