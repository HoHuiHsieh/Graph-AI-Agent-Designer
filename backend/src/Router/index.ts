/**
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import modelsRouter from "./models";
import pythonRouter from "./python";
import ragRouter from "./rag";
import speechRouter from "./speech";


export const routers = [
    modelsRouter,
    pythonRouter,
    ragRouter,
    speechRouter,
]