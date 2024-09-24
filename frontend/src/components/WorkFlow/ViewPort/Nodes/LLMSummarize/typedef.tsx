/**
 * interfaces and node data schema
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import * as yup from "yup";
import { NodeProps } from "reactflow";
import { Message } from "../typedef"


export interface LLMSummarizeNodeProps extends NodeProps {
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
            user: (Message & { role: "user" | "assistant" })[]
        },

        state: false | "pending" | "completed",
    }
}

const parametersSchema = yup.object().shape({
    max_token: yup.number().required().default(512),
    temperature: yup.number().required().default(0.5),
    top_p: yup.number().required().default(0.5),
    top_k: yup.number().required().default(50),
    penalty: yup.number().required().default(1),
})


// const template = "Write a concise summary of the following conversation, return your responses within 5 lines that cover the key points of the conversation.\n{{ prompt }}\nSUMMARY:";
const template = "Write a concise summary of the following conversation:\n{{ prompt }}"
export const schema = yup.object({
    model: yup.string().required().default("llama3-ffm-70b-chat"),
    parameters: parametersSchema,
    prompt: yup.string().required().default(template),
    output: yup.object().default(undefined),
    state: yup.boolean().default(false),
});