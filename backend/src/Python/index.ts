/**
 * @author HoHui Hsieh
 */
import { spawn } from "child_process";
import { readdirSync } from "fs";



const poetryPath = "/root/ai-agent/agent-poetry";


/**
 * 
 * @returns 
 */
export async function getEnvs() {
    // let files = readdirSync(poetryPath, { withFileTypes: true });
    // let folders = files.filter(e => e.isDirectory());
    // return folders.map(e => e.name)
    return ["default"]
}


/**
 * 
 * @param props 
 * @returns 
 */
export async function runPython(props: { env: string, code: string }): Promise<string> {
    return new Promise((resolve, reject) => {
        // child process for code
        // const ls = spawn("poetry", ["run", "python3", "-c", props.code], {
        //     cwd: `${poetryPath}/${props.env || "default"}`
        // });
        const ls = spawn("python3", ["-c", props.code], {});

        // set timeout
        let counter = setTimeout(() => {
            ls.kill()
        }, 10000)

        // catch stdout
        let scriptOutput = "";

        ls.stdout.setEncoding("utf-8");
        ls.stdout.on("data", (data: Buffer) => {
            let result = data.toString("utf-8");
            scriptOutput += result;

        });

        // catch stderr
        let errorOutput = "";
        ls.stderr.setEncoding("utf-8");
        ls.stderr.on("data", (data: Buffer) => {
            let error = data.toString("utf-8");
            errorOutput += error;
        });

        // return caught results
        ls.on("close", (code) => {
            console.log(`child process exited with code ${code}`);
            clearTimeout(counter);
            if (errorOutput) {
                console.error(errorOutput);
                reject(errorOutput);
            } else {
                resolve(scriptOutput)
            }
        });
    })
}
