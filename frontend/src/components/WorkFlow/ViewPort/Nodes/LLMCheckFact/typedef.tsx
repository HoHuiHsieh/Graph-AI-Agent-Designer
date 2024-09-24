/**
 * interfaces and node data schema
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import * as yup from "yup";
import { NodeProps } from "reactflow";
import { Message } from "../typedef"


export interface LLMCheckFactNodeProps extends NodeProps {
    data: {
        model: string,
        parameters: {
            max_token: number,
            temperature: number,
            top_k: number,
            top_p: number,
            penalty: number,
        },
        prompt: string,
        output?: {
            assistant: (Message & { role: "user" | "assistant" })[]
        },

        state: false | "pending" | "completed",
    }
}

const parametersSchema = yup.object().shape({
    max_token: yup.number().required().default(128),
    temperature: yup.number().required().default(0.5),
    top_p: yup.number().required().default(0.5),
    top_k: yup.number().required().default(50),
    penalty: yup.number().required().default(1),
})

const guardrail_prompt = "Your task is to identify if the hypothesis below is grounded and entailed in the evidence below.\nYou will only use the contents of the evidence and not rely on external knowledge.\n\nEvidence:\n{{ evidence }}\n\n\nHypothesis:\n{{ prompt }}\n\n\nQuestion: Does the hypothesis supported by the evidence?\nAnswer:"

export const schema = yup.object({
    model: yup.string().required().default("llama3-ffm-70b-chat"),
    parameters: parametersSchema,
    prompt: yup.string().required().default(guardrail_prompt),
    output: yup.object().default(undefined),
    state: yup.boolean().default(false),
});