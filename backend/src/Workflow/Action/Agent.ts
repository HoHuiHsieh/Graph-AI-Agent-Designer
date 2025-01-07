/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import moment from "moment";
import { ToolUse, ChatCompletion } from "../../Models";
import { ReactFlowNode, ChatRoomMessage } from "../typedef";
import { ActionNodes, DynamicNodeAction, LLMParameters, PIPELINE_NODES, PLANNER_NODES, StaticNodeAction, TOOL_NODES } from "./typedef";
import { runPDFTool, runPromptTool, runPythonTool } from "./Tool";
import { runLLMPlanner, runPromptPlanner } from "./Plan";


interface AgentNode extends ReactFlowNode {
    data: {
        refine_llm: {
            model: string,
            parameters: LLMParameters,
            system: string,
            messages?: ChatRoomMessage[],
        },
        chat_llm: {
            model: string,
            parameters: LLMParameters,
            system: string,
        },
        messages?: ChatRoomMessage[],
        elapsed_time?: number,
    }
}

/** */
export default class AgentAction extends DynamicNodeAction {

    MAX_REFINE = 10;
    node: AgentNode;

    /**
     * 
     * @param node 
     */
    constructor(node: AgentNode) {
        super(node);
        this.node = node;
    }

    /**
     * 
     * @param sources
     * @returns 
     */
    async action(sources: ActionNodes): Promise<AgentAction> {
        const t0 = performance.now();

        // check state
        if (this.checkCompleted()) { return this }
        if (sources.some(e => !e.checkCompleted())) { return this }

        // get messages
        const parent = sources.find(e => PIPELINE_NODES.includes(e.node.type));
        if (!parent) { throw new Error("Pipeline source not connected.") }
        let messages: ChatRoomMessage[] = parent.node.data.messages;
        if (!Array.isArray(messages)) { throw new Error("Messages is empty.") }
        if (messages[messages.length - 1].role !== "user") { throw new Error("The last message should come from the user.") }

        // get tools
        let tools: StaticNodeAction[] = sources.filter(e => TOOL_NODES.includes(e.node.type));
        tools.push(new StaticNodeAction({
            id: "",
            data: { name: "end_of_steps", description: "All steps have been successfully completed." },
            type: ""
        }))

        // run planer
        const planPrompt: string = await this.planner(messages, tools, sources);
        if (!planPrompt) { throw new Error("Plan is empty.") }

        // run knowledge refine
        const instructions: string[] = await this.refine(messages, planPrompt, tools);

        // run chat-completion
        const chatMessages: ChatRoomMessage[] = [
            { role: "system", content: this.node.data?.chat_llm?.system || "" },
            { role: "user", content: instructions.join("\n\n") },
            { role: "assistant", content: "" },
            ...messages,
        ]
        const generated = await ChatCompletion({
            model: this.node.data.chat_llm.model,
            messages: chatMessages,
            parameters: this.node.data.chat_llm.parameters,
        })

        // update messages
        messages = [...messages, {
            role: "assistant",
            content: generated,
            elapsed_time: performance.now() - t0,
            timestamp: moment().format("HH:mm"),
            plan: planPrompt,
            docs: instructions,
        }]
        this.node.data.messages = messages;
        this.setCompleted();
        return this
    }

    /**
     * 
     * @param messages 
     * @param tools 
     * @param sources 
     * @returns 
     */
    async planner(messages: ChatRoomMessage[], tools: StaticNodeAction[], sources: ActionNodes): Promise<string> {
        // get planner node
        const plannerNode = sources.find(e => PLANNER_NODES.includes(e.node.type));
        if (!plannerNode) { throw new Error("Planner not found.") };
        // switch plan methods
        switch (plannerNode.node.type) {
            case "PromptPlan":
                return runPromptPlanner(plannerNode, messages, tools);

            case "LLMPlan":
                return runLLMPlanner(plannerNode, messages, tools);

            default:
                return "";
        }
    }

    /**
     * 
     * @param messages 
     * @param planPrompt 
     * @param tools 
     * @returns 
     */
    async refine(messages: ChatRoomMessage[], planPrompt: string, tools: StaticNodeAction[]): Promise<string[]> {
        let instructions: string[] = [];
        let refineMsg: ChatRoomMessage[] = [
            { role: "system", content: this.node.data?.refine_llm?.system || "" },
            ...(JSON.parse(JSON.stringify(messages))),
            { role: "assistant", content: planPrompt },
        ]
        for (let index = 0; index < this.MAX_REFINE; index++) {
            // generate tool use command
            const cmd = await ToolUse({
                model: this.node.data.refine_llm.model,
                messages: [...refineMsg, { role: "user", content: `Proceed with executing Step ${index + 1}.` }],
                parameters: this.node.data?.refine_llm.parameters,
                functions: tools.map(e => ({
                    name: e.node.data.name,
                    description: e.node.data.description,
                    properties: e.node.data.properties,
                }))
            })
            refineMsg.push({ role: "user", content: `Proceed with executing Step ${index + 1}: ${JSON.stringify(cmd, null, "\t")}` });
            // proceed tool
            const tool = tools.find(e => e.node.data.name === cmd.name)
            switch (tool?.node.type) {
                case "PromptTool":
                    const txt_inst = await runPromptTool(cmd, tool);
                    refineMsg.push({ role: "assistant", content: txt_inst });
                    instructions.push(txt_inst);
                    break;

                case "PythonTool":
                    const python_inst = await runPythonTool(cmd, tool);
                    refineMsg.push({ role: "assistant", content: python_inst });
                    instructions.push(python_inst);
                    break;

                case "PDFTool":
                    const pdf_inst = await runPDFTool(cmd, tool);
                    refineMsg.push({ role: "assistant", content: pdf_inst.join("\n\n") });
                    instructions = [...instructions, ...(pdf_inst || [])];
                    break;

                default:
                    index = this.MAX_REFINE;
                    break;
            }
        }
        // return instructions
        this.node.data = {
            ...this.node.data,
            refine_llm: {
                ...this.node.data.refine_llm,
                messages: refineMsg
            }
        }
        return instructions
    }
}