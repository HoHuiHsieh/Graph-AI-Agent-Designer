/**
 * interfaces and node data schema
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { Node, NodeProps } from "reactflow"
import * as yup from "yup";
import { Message } from "../typedef"


export interface LLMChatCompletionNodeProps extends NodeProps {
    data: {
        model: string,
        parameters: {
            max_token: number,
            temperature: number,
            top_k: number,
            top_p: number,
            penalty: number,
        },
        output?: {
            assistant: (Message & { role: "user" | "assistant" })[]
        },

        state: false | "pending" | "completed",
    }
}

export interface LLMChatCompletionNode extends Node {
    data: LLMChatCompletionNodeProps["data"]
}


const parametersSchema = yup.object().shape({
    max_token: yup.number().required().default(128),
    temperature: yup.number().required().default(0.5),
    top_p: yup.number().required().default(0.5),
    top_k: yup.number().required().default(50),
    penalty: yup.number().required().default(1),
})

export const schema = yup.object({
    model: yup.string().required().default("llama3-ffm-70b-chat"),
    parameters: parametersSchema,
    output: yup.object().default(undefined),
    state: yup.boolean().default(false),
});
