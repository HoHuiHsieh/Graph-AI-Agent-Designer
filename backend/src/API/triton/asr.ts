/**
 * Base model for requests from Triton Inference Server.
 * @author HoHui Hsieh <c95hhh@ncsist.org.tw>
 * @module api/triton
 */
import { TritonCoreAPI } from "./grpc_core";
import { _inference_ModelInferRequest_InferInputTensor } from "./grpc_core/inference/ModelInferRequest";


interface InferenceProps {
    audio: Buffer;
}

/**
 * 
 */
export default class ASR extends TritonCoreAPI {

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
        const { audio } = props;
        const response = await this.modelInfer({
            model_name: this.MODEL_NAME,
            model_version: this.MODEL_VERSION,
            inputs: [{
                name: "input.audio",
                datatype: "BYTES",
                shape: [1],
                contents: {
                    bytes_contents: [audio]
                },
            }],
            outputs: [
                {
                    name: "output.text",
                }
            ]
        })
        const raw_output_contents = response.raw_output_contents as Buffer[];
        return raw_output_contents[0].toString("utf-8", 4);
    }
}