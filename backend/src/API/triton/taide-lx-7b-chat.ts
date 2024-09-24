/**
 * Base model for requests from Triton Inference Server.
 * @author HoHui Hsieh <c95hhh@ncsist.org.tw>
 * @module api/triton
 */
import { TritonCoreAPI } from "./grpc_core";
import { _inference_ModelInferRequest_InferInputTensor } from "./grpc_core/inference/ModelInferRequest";
import { Message } from "./typedef";


interface InferenceProps {
    text_input: string;
    max_tokens: number;
    top_p: number;
    top_k: number;
    temperature: number;
    penalty: number;
}

/**
 * 
 */
export default class TaideLX7BChat extends TritonCoreAPI {

    MODEL_NAME: string = "taide-lx-7b-chat";
    MODEL_VERSION: string = "";
    DEFAULT_MAX_TOKEN: number = 128;
    DEFAULT_TEMPERTURE: number = 0.9;
    DEFAULT_TOP_P: number = 0.95;
    DEFAULT_TOP_K: number = 100;
    DEFAULT_PENALTY: number = 1;
    DEFAULT_STREAMING: boolean = false;

    // Special words
    BOS: string = "<s>";
    EOS: string = "</s>";
    PAD: string = "<pad>";
    B_INST: string = "[INST]";
    E_INST: string = "[/INST]";
    B_SYS: string = "<<SYS>>\n";
    E_SYS: string = "\n<</SYS>>\n\n";

    /**
     * 
     */
    constructor() {
        super("triton-taide:8001");
    }

    /**
     * 
     * @param props 
     * @returns 
     */
    async inference(props: InferenceProps): Promise<string> {
        const { text_input, max_tokens, top_p, top_k, temperature, penalty } = props;
        const response = await this.modelInfer({
            model_name: this.MODEL_NAME,
            model_version: this.MODEL_VERSION,
            inputs: [
                {
                    name: "text_input",
                    datatype: "BYTES",
                    shape: [1, 1],
                    contents: {
                        bytes_contents: [Buffer.from(text_input, "utf8")]
                    },
                },
                {
                    name: "max_tokens",
                    datatype: "INT32",
                    shape: [1, 1],
                    contents: {
                        int_contents: [max_tokens || this.DEFAULT_MAX_TOKEN]
                    },
                },
                {
                    name: "top_p",
                    datatype: "FP32",
                    shape: [1, 1],
                    contents: {
                        fp32_contents: [top_p || this.DEFAULT_TOP_P]
                    },
                },
                {
                    name: "top_k",
                    datatype: "INT32",
                    shape: [1, 1],
                    contents: {
                        int_contents: [top_k || this.DEFAULT_TOP_K]
                    },
                },
                {
                    name: "temperature",
                    datatype: "FP32",
                    shape: [1, 1],
                    contents: {
                        fp32_contents: [temperature || this.DEFAULT_TEMPERTURE]
                    },
                },
                {
                    name: "repetition_penalty",
                    datatype: "FP32",
                    shape: [1, 1],
                    contents: {
                        fp32_contents: [penalty || this.DEFAULT_PENALTY]
                    },
                },
            ],
            outputs: [
                {
                    name: "text_output",
                }
            ]
        })
        const raw_output_contents = response.raw_output_contents as Buffer[];
        return raw_output_contents[0].toString("utf-8", 4);
    }


    /**
     * 
     * @param msgs 
     * @returns 
     */
    parseChatMessages(msgs: Message[]): string {

        let result: string = "";

        // check system message
        if (msgs[0].role == "system") {
            const system_prompt = msgs[0].content.trim();
            const first_user_prompt = msgs[1].content.trim();
            msgs[1].content = `${this.B_SYS}${system_prompt}${this.E_SYS}${first_user_prompt}`;
            msgs.shift();
        }

        // build context
        for (let index = 0; index < msgs.length; index += 2) {
            // get dialogs
            const user_dialog = msgs[index];
            const assistant_dialog = msgs[index + 1];
            if (!assistant_dialog) { break }
            if (user_dialog.role != "user" || assistant_dialog.role != "assistant") {
                throw new Error("Something wrong with dialogs role!")
            }
            // stack dialog contents
            const user_prompt = user_dialog.content.trim();
            const assistant_prompt = assistant_dialog.content.trim();
            result += `${this.BOS}${this.B_INST}${user_prompt}${this.E_INST}${assistant_prompt}${this.EOS}`;
        }
        // last dialog
        const user_dialog = msgs[msgs.length - 1];
        if (user_dialog.role != "user") {
            throw new Error("Role failed to the chat message.");
        }
        const last_user_prompt = user_dialog.content.trim();
        result += `${this.BOS}${this.B_INST}${last_user_prompt}${this.E_INST}`;      
        return result
    }

    /**
     * 
     * @param msgs 
     * @returns 
     */
    parseCodeMessages(msgs: Message[]): string {
        let system_prompt = `${this.BOS}`,
            user_prompt = "";
        if(msgs.length == 2){
            if (msgs[0].role !== "system") { throw new Error("System role is expected in the first message."); }
            if (msgs[1].role !== "user") { throw new Error("User role is expected in the second message."); }
            system_prompt += `${this.B_INST}${this.B_SYS}${msgs[0].content}${this.E_SYS}${this.E_INST}`;
            user_prompt += msgs[1].content;
            return `${system_prompt}${user_prompt}`;
        }
        if(msgs.length == 1){
            if (msgs[0].role !== "user") { throw new Error("User role is expected in the first message."); }
            user_prompt += msgs[0].content;
            return `${system_prompt}${user_prompt}`;
        } 
        throw new Error("Code message length should less than 2.")
    }
}