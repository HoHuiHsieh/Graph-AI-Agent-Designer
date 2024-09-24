/**
 * @author HoHui Hsieh
 */
import { Document } from "@langchain/core/documents";
import { RecursiveUrlLoader } from "@langchain/community/document_loaders/web/recursive_url";
import { compile } from "html-to-text";
import { codeSplitter } from "./splitter";
import { ParseDocumentsProps } from "./typedef";


/**
 * 
 * @param url 
 * @param props 
 * @returns 
 */
export async function loadAsURL(url: string, props: ParseDocumentsProps): Promise<Document[]> {
    let urlloader = new RecursiveUrlLoader(url, {
        extractor: compile({ wordwrap: 130 }),
        maxDepth: 1,
        excludeDirs: [],
    }),
        urlDoc = await urlloader.load();
    return codeSplitter(urlDoc, props, "html")
}
