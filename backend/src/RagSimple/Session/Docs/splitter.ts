/**
 * @author HoHui Hsieh
 */
import { Document } from "@langchain/core/documents";
import { CharacterTextSplitter, SupportedTextSplitterLanguage, RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ParseDocumentsProps } from "./typedef";

/**
 * 
 * @param docs 
 * @param props 
 * @returns 
 */
export function txtSplitter(docs: Document[], props: ParseDocumentsProps): Promise<Document[]> {
    const txtSplitter = new CharacterTextSplitter({
        separator: props.separator,
        keepSeparator: props.keepSeparator,
        chunkSize: props.chunkSize,
        chunkOverlap: props.chunkOverlap,
    });
    return txtSplitter.splitDocuments(docs);
}

/**
 * 
 * @param docs 
 * @param props 
 * @returns 
 */
export function codeSplitter(docs: Document[], props: ParseDocumentsProps, type: SupportedTextSplitterLanguage): Promise<Document[]> {
    const codeSplitter = RecursiveCharacterTextSplitter.fromLanguage(type, {
        chunkSize: props.chunkSize,
        chunkOverlap: props.chunkOverlap,
    });
    return codeSplitter.splitDocuments(docs);
}

