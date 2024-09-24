/**
 * @author HoHui Hsieh
 */
import path from "path";
import Session from "./Session";
import { BuildRequestBody, RetrieveRequestBody, UploadRequestBody } from "./Session/typedef";
import FileDB from "./Session/FileDB";


const folder = Session.folder;
export { folder }


let userSessions: { [key: string]: Session } = {};

/**
 * 
 * @param filename 
 * @returns 
 */
export async function retrievedb(props: RetrieveRequestBody) {
    let session = userSessions[props.id];
    if (!session) { throw new Error("尚未建立Documents.") }
    return session.retrieve(props)
}


/**
 * 
 * @param filename 
 * @returns 
 */
export async function downloaddb(filename: string) {
    const filePath = path.join(Session.folder, filename);
    return filePath
}

/**
 * 
 * @param props 
 */
export async function builddb(props: BuildRequestBody, uploadedFiles: Express.Multer.File[]) {
    const id = props.id;

    if (!id) { throw new Error("'id' is required.") }

    // rebuild session
    let texts = ([props.documents].flat() || []) as string[];
    let files = uploadedFiles.map(e => {
        return new File([e.buffer], e.filename, { type: e.mimetype })
    })
    props.documents = [...texts, ...files].filter(e => e);
    props.parameters.chunkOverlap = Number(props.parameters.chunkOverlap);
    props.parameters.chunkSize = Number(props.parameters.chunkSize);
    props.parameters.keepSeparator = Boolean(props.parameters.keepSeparator);
    props.parameters.separator = props.parameters.separator.replace(/(\r\n|\r|\n)/g, "\n");;
    userSessions[id] = await Session.build(id, props);
    return
}

/**
 * 
 * @param props 
 */
export async function uploaddb(props: UploadRequestBody, uploadedFile: Express.Multer.File) {
    if (!props.id) { throw new Error("'id' is required!") }
    if (!uploadedFile) { throw new Error("'file' is required!") }
    if (!props.model) { throw new Error("'model' is required!") }
    const filename = FileDB.extract(props.id, uploadedFile, Session.folder);
    await new Promise(res => setTimeout(() => res({}), 500));
    userSessions[props.id] = await Session.load(props.id, filename, props.model);
    return
}

/**
 * 
 * @param props 
 */
export async function infodb(props: RetrieveRequestBody) {
    const session = userSessions[props.id];
    if (!session) { throw new Error("RAG database not being built!") }
    // load documents
    let docstore = FileDB.readJson(`${Session.folder}/${session.id}/docstore.json`) as [i: string, { pageContent: string }][]
    let docs = docstore.flatMap(e => e[1].pageContent);
    return {
        model: session.model,
        documents: docs,
        parameters: session.params,
    }
}