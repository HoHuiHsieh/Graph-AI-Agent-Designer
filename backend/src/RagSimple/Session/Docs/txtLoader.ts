/**
 * @author HoHui Hsieh
 */
import { Document } from "@langchain/core/documents";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { ParseDocumentsProps } from "./typedef";



/**
 * 
 * @param text 
 * @param props 
 * @returns 
 */
export async function loadAsString(text: string, props: ParseDocumentsProps): Promise<Document[]> {
    const txtSplitter = new CharacterTextSplitter({
        separator: props.separator,
        keepSeparator: props.keepSeparator,
        chunkSize: props.chunkSize,
        chunkOverlap: props.chunkOverlap,
    });
    return txtSplitter.createDocuments([text]);
}
