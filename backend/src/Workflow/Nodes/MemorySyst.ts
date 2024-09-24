/**
 * @author HoHui Hsieh
 */
import { Node } from "reactflow";
import { DynamicNodeAction, InputData, Message } from "./base";


interface Output {
    system: Message[]
}

/**
 * 
 */
export default class MemorySystAction extends DynamicNodeAction {

    system: Message[];
    input: InputData = {};
    output: Output = {
        system: []
    };

    constructor(node: Node) {
        super(node);
        this.system = node.data.system;
        if (!Array.isArray(this.system)) { throw new Error("'system' is required.") }
    }

    /**
     * 
     */
    async action(sources: DynamicNodeAction[]): Promise<MemorySystAction> {

        // check state
        if (this.checkCompleted()) { return this }
        if (sources.some(e => !e.checkCompleted())) { return this }

        // get input data
        this.input = this.mergeSources(sources.map(e => e?.output || {}));
        let { system } = this.input
        if (!system) { throw new Error("'system' is required.") }
        
        // update node data
        if (system.length > 0) {
            this.system = system;
        }
        this.output.system = this.system;
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
                system: this.system,
                output: this.output,
                state: this.state
            }
        }
    }

}