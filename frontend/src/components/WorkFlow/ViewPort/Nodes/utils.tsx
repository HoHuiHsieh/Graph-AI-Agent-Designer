/**
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { RAGSimpleFuncNodeProps } from "./RAGSimpleFunc/typedef";
import { RAGSimpleInstNodeProps } from "./RAGSimpleInst/typedef";
import { RAGSimpleSystNodeProps } from "./RAGSimpleSyst/typedef";
import { RAGCheckInputNodeProps } from "./RAGCheckInput/typedef";
import { RAGCheckOutputNodeProps } from "./RAGCheckOutput/typedef";
import { ChatSession, Message } from "./typedef";


/**
 * compute node handler position
 * @param total
 * @param index
 * @returns
 */
export function getConnectionHandlePosition(total: number, index: number): number {
    const base = 1;
    const delta = base / (total + 1);
    return 1 - delta * (index + 1)
}

/**
 * merge outputs from source nodes.
 * @param sources 
 * @returns 
 */
export function mergeSources(sources: ChatSession[]): ChatSession & { messages: Message[] } {
    let sess = sources.reduce((out, e) => {
        e = e || {};
        let syst_content = mergeMessages([...(out?.system || []), ...(e?.system || [])]),
            inst_content = mergeMessages([...(out?.instruction || []), ...(e?.instruction || [])]),
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
    const messages = checkMessage([...(sess.system || []), ...(sess.instruction || []), ...(sess.prompt || []), ...(sess.assistant || [])])
    return { ...sess, messages }
}

/**
 * merge message data
 * @param msgs 
 * @returns 
 */
function mergeMessages(msgs: Message[]): string {
    return msgs.reduce((txt, msg) => {
        if (msg.content.replace(/^\s+|\s+$/g, '').trim() !== "") {
            txt += `${msg.content}\n\n`;
        }
        return txt
    }, "")
}


/**
 * check message data format
 * @param msgs 
 * @returns 
 */
function checkMessage(msgs: Message[]): Message[] {
    if (!Array.isArray(msgs)) {
        throw new Error("Message data should be an array.")
    }
    if (msgs.length == 0) { return [] };
    let buf = msgs;
    if (msgs[0].role == "system") {
        buf = msgs.slice(1);
    }
    buf.forEach((msg, index) => {
        if (index % 2 === 0) {
            if (msg.role !== "user") {
                throw new Error("Prompt must alternate between 'user' and 'assistant'")
            }
        } else {
            if (msg.role !== "assistant") {
                throw new Error("Prompt must alternate between 'user' and 'assistant'")
            }
        }
    });
    return msgs
}




type RAGNodeData =
    | RAGSimpleFuncNodeProps["data"]
    | RAGSimpleInstNodeProps["data"]
    | RAGSimpleSystNodeProps["data"]
    | RAGCheckInputNodeProps["data"]
    | RAGCheckOutputNodeProps["data"];

type RAGNodeDocument =
    | RAGSimpleFuncNodeProps["data"]["documents"]
    | RAGSimpleInstNodeProps["data"]["documents"]
    | RAGSimpleSystNodeProps["data"]["documents"]
    | RAGCheckInputNodeProps["data"]["documents"]
    | RAGCheckOutputNodeProps["data"]["documents"];

/**
 * Convert RAG properties
 */
export class ConvRAGData {

    /**
     * decode props
     * @param data 
     * @returns 
     */
    static decode(data: RAGNodeData, defaultDocument: RAGNodeDocument): RAGNodeData {
        let { documents, ...props } = data;
        let values: RAGNodeData = JSON.parse(JSON.stringify(props));
        if (values?.parameters?.separator) {
            values.parameters.separator = values.parameters.separator.replaceAll(/(\n)/g, "\\n");
        }
        values.documents = documents || defaultDocument;
        return values
    }

    /**
     * encode props
     * @param data 
     * @returns 
     */
    static encode(data: RAGNodeData, defaultDocument: RAGNodeDocument): RAGNodeData {
        let { documents, ...props } = data;
        let values: RAGNodeData = JSON.parse(JSON.stringify(props, (k, v) => (v === undefined ? null : v)));
        values.parameters.separator = values.parameters.separator.replaceAll(/(\\n)/g, "\n");
        values.documents = documents || defaultDocument;
        return values
    }
}