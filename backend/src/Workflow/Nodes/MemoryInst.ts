/**
 * @author HoHui Hsieh
 */
import { Node } from "reactflow";
import { DynamicNodeAction, InputData, Message } from "./base";


interface Output {
    instruction: Message[]
}

/**
 * 
 */
export default class MemoryInstAction extends DynamicNodeAction {

    instruction: Message[];
    input: InputData = {};
    output: Output = {
        instruction: []
    };

    constructor(node: Node) {
        super(node);
        this.instruction = node.data.instruction;
        if (!Array.isArray(this.instruction)) { throw new Error("'instruction' is required.") }
    }

    /**
     * 
     */
    async action(sources: DynamicNodeAction[]): Promise<MemoryInstAction> {

        // check state
        if (this.checkCompleted()) { return this }
        if (sources.some(e => !e.checkCompleted())) { return this }

        // get input data
        this.input = this.mergeSources(sources.map(e => e?.output || {}));
        let { instruction } = this.input
        if (!instruction) { throw new Error("'instruction' is required.") }

        // update memory
        if (instruction.length > 0) {
            this.instruction = instruction;
        }
        this.output.instruction = this.instruction;
        this.setCompleted()
        return this
    }

    /**
     * 
     * @returns 
     */
    getNode() {
        return {
            ...this.node,
            data: {
                ...(this.node.data || {}),
                instruction: this.instruction,
                output: this.output,
                state: this.state
            }
        }
    }

}