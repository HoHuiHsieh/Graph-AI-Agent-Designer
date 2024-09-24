/**
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { Router, Request, Response } from "express";
import { applyASR, applyTTS } from "../Speech";


const router = Router();

// handle tts requests
router.post(`/speech/tts`, (request: Request, response: Response<string>) => {
    applyTTS(request.body.text as string)
        .then((result) => {
            response.send(result)
        })
        .catch((error) => {
            response.status(500).send(error)
        })
});

// handle ASR requests
router.post(`/speech/asr`, (request: Request, response: Response<string>) => {
    applyASR(request.body.audio as string)
        .then((result) => {
            response.send(result)
        })
        .catch((error) => {
            response.status(500).send(error)
        })
});

export default router