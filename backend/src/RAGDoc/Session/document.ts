/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { Document } from "@langchain/core/documents";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CharacterTextSplitter, RecursiveCharacterTextSplitter } from "langchain/text_splitter";


/**
 * 
 * @param file 
 * @returns 
 */
export async function loadFile(file: File): Promise<Document[]> {
    switch (file.type) {
        case "application/pdf":
            const pdfLoader = new PDFLoader(file, { splitPages: false });
            let pdfDocs = await pdfLoader.load();
            return textSplitter(pdfDocs);

        default:
            throw new Error(`Invalid file type of ${file.name}`);
    }
}

/**
 * 
 * @param docs 
 * @returns 
 */
async function textSplitter(docs:Document[]):Promise<Document[]>{
    const txtSplitter = new RecursiveCharacterTextSplitter({
        keepSeparator: true,
        chunkSize: 500,
        chunkOverlap: 0,
    })
    return txtSplitter.splitDocuments(docs)
}