/**
 * @author HoHui Hsieh
 */
import { Node } from "reactflow";


export interface Message {
    role: "user" | "assistant" | "system",
    content: string,
    elapsed_time?: number,
    timestamp?: string
}

export interface InputData {
    system?: Message[],
    instruction?: Message[],
    prompt?: Message[],
    assistant?: Message[],
    function?: {
        name: string,
        arguments: { [key: string]: any }
    },
    messages?: Message[],
}



export class StaticNodeAction {

    output?: InputData;
    node: Node;

    constructor(node: Node) {
        this.node = node;
        this.output = node.data.output;
    }

    /**
     * 
     */
    async action(sources?: any): Promise<StaticNodeAction> {
        return this
    }

    /**
    * placeholder
    */
    setPending() { }

    /**
    * placeholder
    * @returns 
    */
    checkCompleted() {
        return true
    }

    /**
     * 
     * @returns 
     */
    getNode() {
        return this.node
    }

    /**
     * 
     * @param sources 
     * @returns 
     */
    mergeSources(sources: InputData[]): InputData {
        let sess = sources.reduce((out, e) => {
            e = e || {};
            let syst_content = this.mergeMessages([...(out?.system || []), ...(e?.system || [])]),
                inst_content = this.mergeMessages([...(out?.instruction || []), ...(e?.instruction || [])]),
                system_msgs: Message[] = syst_content ? [{ role: "system", content: syst_content }] : [],
                instru_msgs: Message[] = inst_content ? [{ role: "user", content: inst_content }, { role: "assistant", content: "" }] : [];
            out = { ...out, system: system_msgs };
            out = { ...out, instruction: instru_msgs };
            out = { ...out, prompt: [...(out?.prompt || []), ...(e?.prompt || [])] };
            out = { ...out, assistant: [...(out?.assistant || []), ...(e?.assistant || [])] };
            out = { ...out, function: (e?.function || out?.function) }
            return out
        }, {
            system: [] as Message[],
            instruction: [] as Message[],
            prompt: [] as Message[],
            assistant: [] as Message[],
            function: undefined,
        })
        if (typeof sess.function?.arguments == "string") {
            sess.function.arguments = {}
        }
        const messages = this.checkMessage([...(sess.system || []), ...(sess.instruction || []), ...(sess.prompt || []), ...(sess.assistant || [])])
        return { ...sess, messages }
    }

    /**
     * 
     * @param msgs 
     * @returns 
     */
    private mergeMessages(msgs: Message[]): string {
        return msgs.reduce((txt, msg) => {
            if (msg.content.replace(/^\s+|\s+$/g, '').trim() !== "") {
                txt += `${msg.content}\n\n`;
            }
            return txt
        }, "")
    }

    /**
     * 
     * @param msgs 
     * @returns 
     */
    private checkMessage(msgs: Message[]): Message[] {
        if (!Array.isArray(msgs)) {
            throw new Error("System Prompt 應屬於陣列！")
        }
        if (msgs.length == 0) { return [] };
        let buf = msgs;
        if (msgs[0].role == "system") {
            buf = msgs.slice(1);
        }
        buf.forEach((msg, index) => {
            if (index % 2 === 0) {
                if (msg.role !== "user") {
                    throw new Error("User Prompt 格式錯誤！")
                }
            } else {
                if (msg.role !== "assistant") {
                    throw new Error("Bot Response 格式錯誤！")
                }
            }
        });
        return msgs
    }
}


export class DynamicNodeAction extends StaticNodeAction {
    state: "pending" | "completed";

    constructor(node: Node) {
        super(node)
        this.state = "pending";
    }

    /**
     * 
     * @param sources 
     */
    async action(sources: DynamicNodeAction[]): Promise<DynamicNodeAction> {
        if (sources.some(e => !e.checkCompleted())) { return this }
        this.setCompleted();
        return this
    }

    /**
     * set node state to pending
     */
    setPending() {
        this.state = "pending";
    }

    /**
     * set node state to completed
     */
    setCompleted() {
        this.state = "completed";
    }

    /**
     * check node state is pending or not
     * @returns 
     */
    checkCompleted(): boolean {
        return this.state === "completed";
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
                output: this.output,
                state: this.state
            }
        }
    }

}
