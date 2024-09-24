/**
 * interfaces and node data schema
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { NodeProps } from "reactflow";
import * as yup from "yup";
import { Message } from "../typedef";


export interface MemoryInstNodeProps extends NodeProps {
    data: {
        instruction: Message[],
        output?: {
            instruction: Message[]
        },
    }
}


const message_schema = yup.object().shape({
    role: yup.string().required().default(""),
    content: yup.string().required().default(""),
})


export const schema = yup.object({
    instruction: yup.array().of(message_schema).default([]),
    output: yup.object().default(undefined),
});