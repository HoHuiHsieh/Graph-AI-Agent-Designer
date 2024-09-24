/**
 * @author HoHui Hsieh
 */
import tar from "tar-fs";
import fs from "fs";


/**
 * 
 */
export default class FileDB {

    /**
     * 
     * @param foldername 
     */
    /**
     * Pack a folder.
     * @param foldername Target folder.
     * @returns Packed filename.
     */
    static pack(foldername: string): string {
        if (!FileDB.exist(foldername)) {
            throw new Error(`No such file or directory, open: ${foldername}`);
        }
        let tarFilename = `${foldername}.tar`;
        tar.pack(foldername).pipe(fs.createWriteStream(tarFilename));
        return tarFilename
    }

    /**
     * Extract uploaded tar file.
     * @param filename 
     * @returns Extracted folder name.
     */
    static extract(id: string, file: Express.Multer.File, path: string): string {
        let filename = `${path}/${id}`,
            tarFilename = `${filename}.tar`;
        fs.writeFileSync(tarFilename, file.buffer);
        fs.createReadStream(tarFilename).pipe(tar.extract(filename));
        return filename
    }

    /**
     * Check folder or file existed.
     * @param filename Target folder or file name.
     * @returns true or false
     */
    static exist(filename: string): boolean {
        return fs.existsSync(filename)
    }


    /**
     * 
     * @param obj 
     */
    static dumpJson(obj: any, filename: string) {
        return fs.writeFileSync(filename, JSON.stringify(obj, null, "\t"), "utf8");
    }

    /**
     * 
     * @param filename 
     * @returns 
     */
    static readJson(filename: string): any {
        return JSON.parse(fs.readFileSync(filename, "utf8"));
    }
}
