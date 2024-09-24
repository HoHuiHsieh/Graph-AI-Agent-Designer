/**
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { Router, Request, Response } from "express";
import { getModels, chatCompletion, codeCompletion, LLMInferenceProps } from "../Models";


const router = Router();

// get model list
router.get("/model", (request: Request, response: Response) => {
    response.send(getModels())
});


// handle chat completion requests
router.post(`/model/chatCompletion`, (request: Request<{}, {}, LLMInferenceProps>, response: Response<string>) => {
    chatCompletion(request.body)
        .then((result) => {
            response.send(result);
        })
        .catch((error) => {
            console.error(error);
            response.status(500).send(error);
        })
});


// handle code completion requests
router.post(`/model/codeCompletion`, (request: Request<{}, {}, LLMInferenceProps>, response: Response<string>) => {
    codeCompletion(request.body)
        .then((result) => {
            response.send(result);
        })
        .catch((error) => {
            console.error(error);
            response.status(500).send(error);
        })
});


export default router