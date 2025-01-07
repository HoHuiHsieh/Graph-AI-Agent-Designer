/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { Router, Request, Response } from "express";
import multer from "multer";
import { getModels, ASR, TTS } from "../Models";


const router = Router();
const upload = multer({ storage: multer.memoryStorage() });


// get model list
router.get("/model", (request: Request, response: Response) => {
    response.send(getModels())
});

// handle tts requests
interface TTSRequest {
    model: string,
    input: string,
    voice?: any
}
router.post(`/model/tts`, (request: Request<{}, {}, TTSRequest>, response: Response<string>) => {
    const { model, input, voice } = request.body;
    TTS(model, input, voice)
        .then((result) => {
            response.send(result)
        })
        .catch((error) => {
            response.status(500).send(error)
        })
});

// handle ASR requests
router.post(`/model/asr`, upload.single("file"), (request: Request<{}, {}, { model: string, }>, response: Response<string>) => {
    const file = request.file;
    if (!file) {
        response.status(500).send("ASR file not been uploaded.")
        return
    }
    const { model } = request.body;
    const domFile = new File([file.buffer], file.filename, { type: file.mimetype });
    ASR(model, domFile)
        .then((result) => {
            response.send(result)
        })
        .catch((error) => {
            response.status(500).send(error)
        })
});

export default router