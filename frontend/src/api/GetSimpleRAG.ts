/**
 * add interfaces and methods for RAG API
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import HttpBase from "./HttpBase";


export interface Message {
    role: "user" | "assistant" | "system",
    content: string,
}

export interface RAGBuildRequestBody {
    id: string,
    model: string,
    documents: (File | string)[],
    parameters: {
        chunkOverlap: number;
        chunkSize: number;
        keepSeparator: boolean;
        separator: string;
    }
}

export interface RAGUploadRequestBody {
    id: string,
    model: string,
    file: File,
}


export interface RAGRetrieveRequestBody {
    id: string,
    messages: Message[],
    num_retrieve?: number,
}


export interface RAGResponseData {
    result: string
}

export interface RAGInfoData {
    model: string,
    documents: string[],
    parameters: {
        chunkOverlap: number;
        chunkSize: number;
        keepSeparator: boolean;
        separator: string;
        num_retrieve: number;
        threshold: number;
    }
}

export const RAG_SUPPORTED_FILE = [
    "txt", "json", "csv", "pdf", "docx",
    "pptx", "md", "cpp", "js", "ts",
    "tsx", "py", "html"
]



/**
 * class for RAG API
 */
export default class GetSimpleRAG extends HttpBase {

    path: string = "/app/rag/simple"

    constructor(key?: string, path?: string) {
        super(key, path);
    }

    /**
     * handle rag build requests
     * @param props 
     * @returns 
     */
    async build(props: RAGBuildRequestBody): Promise<void> {
        try {
            let body = new FormData();
            body.append("id", props.id)
            body.append("model", props.model)
            props.documents.forEach(element => {
                body.append("documents", element);
            });
            body.append("parameters[chunkOverlap]", props.parameters.chunkOverlap.toString());
            body.append("parameters[chunkSize]", props.parameters.chunkSize.toString())
            body.append("parameters[keepSeparator]", props.parameters.keepSeparator ? "true" : "false")
            body.append("parameters[separator]", props.parameters.separator.toString())
            let response = await this.instance.post(`${this.path}/build`, body, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            return response.data

        } catch (error) {
            throw error;
        }
    }

    /**
     * handle Upload DB file requests
     * @param props 
     * @returns 
     */
    async upload(props: RAGUploadRequestBody): Promise<void> {
        try {
            let body = new FormData();
            body.append("id", props.id)
            body.append("model", props.model)
            body.append("file", props.file)
            let response = await this.instance.post(`${this.path}/upload`, body, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            return response.data

        } catch (error) {
            throw error;
        }
    }

    /**
     * retrieve data from RAG API
     * @param props 
     * @returns 
     */
    async retrieve(props: RAGRetrieveRequestBody): Promise<RAGResponseData> {
        try {
            let body: RAGRetrieveRequestBody = {
                id: props.id,
                messages: props.messages,
            }
            let response = await this.instance.post(`${this.path}/retrieve`, body);
            return response.data

        } catch (error) {
            throw error;
        }
    }

    /**
     * retrieve rag info data
     * @param props 
     * @returns 
     */
    async info(props: { id: string }): Promise<RAGInfoData> {
        try {
            let body: RAGRetrieveRequestBody = {
                id: props.id,
                messages: [],
            }
            let response = await this.instance.post(`${this.path}/info`, body);
            return response.data

        } catch (error) {
            throw error;
        }
    }

    /**
     * Download DB
     * @param id 
     * @returns 
     */
    async download(id: string, name: string): Promise<void> {
        try {
            const response = await this.instance.get(`${this.path}/upload/${id}.tar`, { responseType: "blob" });
            // create file link in browser's memory
            const href = URL.createObjectURL(response.data);
            // create "a" HTML element with href to file & click
            const link = document.createElement('a');
            link.href = href;
            link.setAttribute("download", `${name}.tar`); //or any other extension
            document.body.appendChild(link);
            link.click();
            // clean up "a" element & remove ObjectURL
            document.body.removeChild(link);
            URL.revokeObjectURL(href);

        } catch (error) {
            throw error;
        }
    }

}
