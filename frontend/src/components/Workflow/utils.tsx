/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { DiagramData } from "./typedef";



/**
 * 
 * @param document 
 * @param filename 
 * @param data 
 */
export function download(document: Document, filename: string, data: any) {
    if (!filename) { return }
    let contentType = "application/json;charset=utf-8;";
    let a = document.createElement("a");
    a.download = `${filename}.json`;
    a.href = "data:" + contentType + "," + encodeURIComponent(JSON.stringify(data, null, 4));
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}


/**
 * 
 * @param reader 
 * @param file 
 * @param callback 
 * @returns 
 */
export function upload(reader: FileReader, file: File, callback: (data: DiagramData, file: File) => void) {
    if (!file) { return }
    reader.onloadend = async () => {
        let data: DiagramData = JSON.parse(await file.text());
        if (Array.isArray(data?.nodes) && Array.isArray(data?.edges)) {
            callback(data, file);
        } else {
            throw new Error("Broken file.");
        }
    };
    reader.readAsDataURL(file);
}