/**
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { Router, Request, Response } from "express";
import multer from "multer";
import { downloaddb, builddb, uploaddb, infodb, folder } from "../RagSimple";


const router = Router();
const upload = multer({ dest: folder, storage: multer.memoryStorage() });


// handle Download DB requests.
router.get(`/rag/simple/upload/:filename`,
    (request: Request, response: Response) => {
        downloaddb(request.params.filename)
            .then((filename) => {
                response.sendFile(filename);
            })
            .catch((error) => {
                console.error(error);
                response.status(500).send(error)
            })
    });


// handle Build DB requests.
router.post(`/rag/simple/build`,
    upload.array("documents"),
    (request: Request, response: Response) => {
        let uploadedFiles = (request.files || [request.file] || []) as Express.Multer.File[]
        builddb(request.body, uploadedFiles)
            .then((result) => {
                response.send(result);
            })
            .catch((error) => {
                console.error(error);
                response.status(500).send(error)
            })
    });


// handle Upload DB requests.
router.post(`/rag/simple/upload`,
    upload.single("file"),
    (request: Request, response: Response) => {
        let uploadedFile = request.file as Express.Multer.File;
        uploaddb(request.body, uploadedFile)
            .then((result) => {
                response.send(result);
            })
            .catch((error) => {
                console.error(error);
                response.status(500).send(error)
            })
    });


// handle get RAG DB info requests.
router.post(`/rag/simple/info`,
    (request: Request, response: Response) => {
        infodb(request.body)
            .then((result) => {
                response.send(result);
            })
            .catch((error) => {
                response.status(500).send(error)
            })
    });


export default router