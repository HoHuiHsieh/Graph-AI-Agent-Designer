/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { ReactFlowNode } from "../typedef";


/** */
export class StaticNodeAction {
    state: "pending" | "completed";
    node: ReactFlowNode;

    constructor(node: ReactFlowNode) {
        this.node = node;
        this.state = "pending";
        this.node.data.state = "pending";
    }

    /**
     * 
     * @param sources 
     * @returns 
     */
    async action(sources?: any[]): Promise<StaticNodeAction> {
        this.setCompleted();
        return this
    }

    /**
     * 
     */
    setCompleted() {
        this.state = "completed";
        this.node.data.state = "completed";
    }

    /**
     * 
     * @returns 
     */
    checkCompleted() {
        return this.state === "completed"
    }

    /**
     * 
     */
    getNode() {
        return this.node
    }
}


/** */
export class DynamicNodeAction extends StaticNodeAction {
    state: "pending" | "completed";
    node: ReactFlowNode;

    constructor(node: ReactFlowNode) {
        super(node)
        this.node = node;
        this.state = "pending";
        this.node.data.state = "pending";
    }

    /**
     * 
     * @param sources 
     * @returns 
     */
    async action(sources: any[]): Promise<DynamicNodeAction> {
        if (sources.some(e => !e.checkCompleted())) { return this }
        this.setCompleted();
        return this
    }
}

/** */
export type ActionNodes = (DynamicNodeAction | StaticNodeAction)[];

/** */
export interface LLMParameters {
    max_completion_tokens: number,
    min_length: number,
    temperature: number,
    top_p: number,
    top_k: number,
    length_penalty: number,
    repetition_penalty: number,
    presence_penalty: number,
    frequency_penalty: number,
}

/** */
export const PIPELINE_NODES = ["EntryPoint", "Guardrail", "CheckFact", "Agent"];
export const PLANNER_NODES = ["PromptPlan", "LLMPlan"];
export const TOOL_NODES = ["PythonTool", "PromptTool", "PDFTool"];