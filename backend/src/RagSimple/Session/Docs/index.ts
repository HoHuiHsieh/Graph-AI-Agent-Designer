/**
 * @author HoHui Hsieh
 */
import { loadAsFile } from "./fileLoader";
import { loadAsString } from "./txtLoader";
import { loadAsURL } from "./urlLoader";
import { ParseDocumentsProps } from "./typedef";


/**
 * 
 * @param props 
 * @param raw 
 * @returns 
 */
export async function parseDocuments(props: ParseDocumentsProps, raw: (File | string)[]) {

    let docs = await Promise.all(raw.flatMap((doc) => {
        // handle file
        if (doc instanceof File) {
            return loadAsFile(doc, props)
        }
        // handle url
        if (isValidHttpUrl(doc)) {
            return loadAsURL(doc, props)
        }
        // handle text
        return loadAsString(doc, props)
    }))
    return docs.flat()
}


/**
 * 
 * @param str 
 * @returns 
 */
function isValidHttpUrl(str: string): boolean {
    let url;
    try {
        url = new URL(str);
    } catch (_) {
        return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
}
