/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import * as crypto from "crypto";
import Session from "./session";


/** */
export default class SessionManager {
    sessionRepository: { [key: string]: Session }

    /** */
    constructor() {
        this.sessionRepository = {}
    }

    /**
     * 
     * @param file 
     * @returns 
     */
    async upload(file: File): Promise<string> {
        const checksum = await this.checksum(file);
        if (!(checksum in this.sessionRepository)) {
            // build document
            this.sessionRepository[checksum] = Session.upload(file);
            // remove document in 1 hour.
            let sess = this.sessionRepository[checksum];
            sess.timeoutID = this.callbackIn1Hr(() => {
                delete this.sessionRepository[checksum];
            })
        }
        return checksum
    }

    /**
     * 
     * @param checksum 
     * @param prompt 
     * @returns 
     */
    async retrieve(checksum: string, prompt: string): Promise<string[]> {
        let sess = this.sessionRepository[checksum];
        if (!sess) { throw new Error("Document not uploaded.") }
        if (!sess.retriever) {
            // build document if not existed
            await sess.build();
            // remove document at midnight
            if (sess.timeoutID) { clearTimeout(sess.timeoutID) }
            sess.timeoutID = this.callbackAt0AM(()=>{
                delete this.sessionRepository[checksum];
            })
        }
        return sess.retrieve(prompt);
    }

    /**
     * 
     * @param callback 
     * @returns 
     */
    private callbackAt0AM(callback: () => void): NodeJS.Timeout {
        const now = new Date();
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const midnight = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 0, 0, 0);
        const timeDiff = midnight.getTime() - now.getTime();
        return setTimeout(callback, timeDiff)
    }

    /**
     * 
     * @param callback 
     * @returns 
     */
    private callbackIn1Hr(callback: () => void): NodeJS.Timeout {
        return setTimeout(callback, 3600000)
    }

    /**
     * 
     * @param file 
     * @returns 
     */
    private async checksum(file: File): Promise<string> {
        const arrayBuffer = await file.arrayBuffer();
        const fileBuff = Buffer.from(arrayBuffer);
        const checksum = crypto.createHash("md5").update(fileBuff).digest("hex");
        return checksum
    }

}