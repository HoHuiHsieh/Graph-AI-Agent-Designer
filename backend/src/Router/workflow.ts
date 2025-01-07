/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { Router, Request, Response } from "express";
import runWorkFlow, { WorkFlowRequestProps, WorkFlowResponse } from "../Workflow";


const router = Router();

// handle chat completion requests
router.post(`/workflow`, (request: Request<{}, {}, WorkFlowRequestProps>, response: Response<WorkFlowResponse>) => {
    runWorkFlow(request.body)
        .then((result) => {
            response.send(result);
        })
        .catch((error) => {
            console.error(error);
            response.status(500).send(error);
        })
});

export default router