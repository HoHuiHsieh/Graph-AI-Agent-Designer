/**
 * Base model for requests from Triton Inference Server.
 * @author HoHui Hsieh <c95hhh@ncsist.org.tw>
 * @module api/triton
 */
import { TritonCoreAPI } from "./grpc_core";
import { _inference_ModelInferRequest_InferInputTensor } from "./grpc_core/inference/ModelInferRequest";


interface InferenceProps {
    text: string;
}

/**
 * 
 */
export default class TTS extends TritonCoreAPI {

    MODEL_NAME: string = "seamless-m4t-v2-large";
    MODEL_VERSION: string = "";

    /**
     * 
     */
    constructor() {
        super("triton:8001");
    }

    /**
     * 
     * @param props 
     * @returns 
     */
    async inference(props: InferenceProps): Promise<string> {
        const { text } = props;
        const response = await this.modelInfer({
            model_name: this.MODEL_NAME,
            model_version: this.MODEL_VERSION,
            inputs: [{
                name: "input.text",
                datatype: "BYTES",
                shape: [1],
                contents: {
                    bytes_contents: [Buffer.from(text, "utf8")]
                },
            }],
            outputs: [
                {
                    name: "output.audio",
                }
            ]
        })
        const raw_output_contents = response.raw_output_contents as Buffer[];
        return raw_output_contents[0].toString("utf-8", 4);
    }
}