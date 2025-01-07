/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { Router, Request, Response } from "express";
import multer from "multer";
import { uploadFile } from "../RAGDoc";


const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// handle upload document requests.
router.post(`/doc/upload`, upload.single("file"), (request: Request, response: Response) => {
    const file = request.file;
    if (!file) {
        response.status(500).send("Document not been uploaded.")
        return
    }
    const domFile = new File([file.buffer], file.filename, { type: file.mimetype });
    uploadFile(domFile)
        .then((result) => {
            response.send(result);
        })
        .catch((error) => {
            console.error(error);
            response.status(500).send(error)
        })
});


export default router