/**
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { Router, Request, Response } from "express";
import { getEnvs, runPython } from "../Python";


const router = Router();

// get python env.
router.get("/python", (request: Request, response: Response) => {
    getEnvs()
        .then((result) => {
            response.send(result)
        })
        .catch((error) => {
            response.status(500).send(error)
        })
});

// execute python code
router.post("/python", (request: Request, response: Response) => {
    runPython(request.body)
        .then((result) => {
            response.send(result)
        })
        .catch((error) => {
            response.status(500).send(error)
        })
});


export default router