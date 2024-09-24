/**
 * @author HoHui Hsieh
 */
import { Node } from "reactflow";
import { DynamicNodeAction, InputData, Message } from "./base";
import { runPython } from "../../Python";
import moment from "moment";


interface Output {
    system: Message[]
}

/**
 * 
 */
export default class PythonRunSystAction extends DynamicNodeAction {

    code: string
    env: string
    input: InputData = {};
    output: Output = {
        system: []
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
    async action(sources?: DynamicNodeAction[]): Promise<PythonRunSystAction> {
        let t0 = performance.now();

        // check state
        if (this.checkCompleted()) { return this }

        // exetcute
        const call_res = await runPython({
            code: this.code,
            env: this.env,
        }).catch((error) => error.message || JSON.stringify(error));

        // update node data
        this.output.system = call_res ? [
            {
                role: "system",
                content: `${call_res}`,
                timestamp: moment().format("HH:mm"),
                elapsed_time: performance.now() - t0,
            }
        ] : [];
        this.setCompleted()
        return this
    }

}