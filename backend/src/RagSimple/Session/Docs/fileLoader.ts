/**
 * @author HoHui Hsieh
 */
import { Document } from "@langchain/core/documents";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { PPTXLoader } from "@langchain/community/document_loaders/fs/pptx";
import { txtSplitter, codeSplitter } from "./splitter";
import { BuildRequestBody } from "../typedef";


/**
 * Load and split file contents.
 * @param file 
 * @param props 
 * @returns 
 */
export async function loadAsFile(file: File, props: BuildRequestBody["parameters"]): Promise<Document[]> {
    switch (file.type) {
        case "text/plain":
            let txtLoader = new TextLoader(file),
                txtDoc = await txtLoader.load();
            return txtSplitter(txtDoc, props)

        case "application/json":
            let jsonLoader = new JSONLoader(file),
                jsonDoc = await jsonLoader.load();
            return txtSplitter(jsonDoc, props)

        case "text/csv":
            let csvLoader = new CSVLoader(file),
                csvDoc = await csvLoader.load();
            return txtSplitter(csvDoc, props)

        case "application/pdf":
            let pdfLoader = new PDFLoader(file, { splitPages: false }),
                pdfDoc = await pdfLoader.load();
            return txtSplitter(pdfDoc, props)

        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            let docxLoader = new DocxLoader(file),
                docxDoc = await docxLoader.load();
            return txtSplitter(docxDoc, props)

        case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
            let pptxLoader = new PPTXLoader(file),
                pptxDoc = await pptxLoader.load();
            return txtSplitter(pptxDoc, props)

        case "text/markdown":
            let mdLoader = new TextLoader(file),
                mdDoc = await mdLoader.load();
            return codeSplitter(mdDoc, props, "markdown")

        case "text/x-c++src":
            let cppLoader = new TextLoader(file),
                cppDoc = await cppLoader.load();
            return codeSplitter(cppDoc, props, "cpp")

        case "text/javascript":
            let jsLoader = new TextLoader(file),
                jsDoc = await jsLoader.load();
            return codeSplitter(jsDoc, props, "js")

        case "text/x-typescript":
            let tsLoader = new TextLoader(file),
                tsDoc = await tsLoader.load();
            return codeSplitter(tsDoc, props, "js")

        case "text/x-python":
            let pyLoader = new TextLoader(file),
                pyDoc = await pyLoader.load();
            return codeSplitter(pyDoc, props, "python")

        case "text/html":
            let htmlLoader = new TextLoader(file),
                htmlDoc = await htmlLoader.load();
            return codeSplitter(htmlDoc, props, "html")

        default:
            throw new Error(`Invilid file type: ${file.name}`)
    }
}
