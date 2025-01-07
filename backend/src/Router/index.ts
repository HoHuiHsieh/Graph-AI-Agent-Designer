/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import modelsRouter from "./models";
import pythonRouter from "./python";
import ragRouter from "./rag";
import workflowRouter from "./workflow"


export const routers = [
    modelsRouter,
    pythonRouter,
    ragRouter,
    workflowRouter
]