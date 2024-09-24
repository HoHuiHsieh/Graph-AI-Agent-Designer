/**
 * @author HoHui Hsieh
 */
import { Node } from "reactflow";
import { DynamicNodeAction, InputData, Message } from "./base";
import { runPython } from "../../Python";
import moment from "moment";


interface Output {
    instruction: Message[]
}

/**
 * 
 */
export default class PythonCallInstAction extends DynamicNodeAction {

    code: string
    env: string
    input: InputData = {};
    output: Output = {
        instruction: []
    };

    constructor(node: Node) {
        super(node);
        this.code = node.data.code;
        this.env = node.data.env;
        if (!this.code) { throw new Error("'code' is required.") }
        if (!this.env) { throw new Error("'env' is required.") }
    }

    /**
     * 
     */
    async action(sources: DynamicNodeAction[]): Promise<PythonCallInstAction> {
        let t0 = performance.now();

        // check state
        if (this.checkCompleted()) { return this }
        if (sources.some(e => !e.checkCompleted())) { return this }

        // get input data
        this.input = this.mergeSources(sources.map(e => e?.output || {}));
        if (!this.input.function) {
            // no calling for no function
            this.output.instruction = [];
            this.setCompleted();
            return this
        }
        if (!this.input.function.name) {
            // no calling for no function
            this.output.instruction = [];
            this.setCompleted();
            return this
        }

        // insert code
        let call_code: string = JSON.parse(JSON.stringify(this.code));
        let args = this.input.function?.arguments || {};
        let c_args = Object.keys(args).reduce((arg, key) => {
            if (key in args) {
                return { ...arg, [key]: args[key] }
            }
            return arg
        }, {})
        let cmd = `${this.input.function.name}(**${JSON.stringify(c_args)})`;
        call_code += `\n\nprint(${cmd})`;

        // exetcute
        const call_res = await runPython({
            code: call_code,
            env: this.env,
        }).catch((error) => error.message || JSON.stringify(error));

        // update node data
        this.output.instruction = call_res ? [
            {
                role: "user",
                content: `${call_res}`,
                timestamp: moment().format("HH:mm"),
                elapsed_time: performance.now() - t0,
            }, {
                role: "assistant",
                content: "",
                timestamp: moment().format("HH:mm"),
                elapsed_time: performance.now() - t0,
            },
        ] : [];
        this.setCompleted()
        return this
    }

}