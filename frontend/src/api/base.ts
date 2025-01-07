/**
 * add HttpBase class for handling HTTP requests with axios
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import axios, { AxiosInstance } from "axios";


/** */
export const instance: AxiosInstance = axios.create({
    baseURL: "/app",
    timeout: 120000,
    headers: {
        "Authorization": process.env.ACCESS_TOKEN || "",
        "Content-Type": "application/json",
    }
});
