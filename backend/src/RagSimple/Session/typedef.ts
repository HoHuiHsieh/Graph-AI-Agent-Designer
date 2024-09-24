/**
 * @author HoHui Hsieh
 */
import { ParseDocumentsProps } from "./Docs/typedef";

// define output data types
export interface Message {
    role: "user" | "assistant" | "system",
    content: string,
    elapsed_time?: number,
}

export interface BuildRequestBody {
    id: string,
    model: string,
    documents: (File | string)[],
    parameters: ParseDocumentsProps,
}

export interface UploadRequestBody {
    id: string,
    model: string,
    file: File,
}


export interface RetrieveRequestBody {
    id: string,
    messages: Message[],
    threshold:  number,
    num_retrieve?: number,
}



