/**
 * interfaces and node data schema
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { NodeProps } from "reactflow";
import * as yup from "yup";
import { Message } from "../typedef";


export interface TextfieldInstNodeProps extends NodeProps {
    data: {
        text: string,
        output?: {
            instruction: (Message & { role: "user" | "assistant" })[]
        },
    }
}


export const schema = yup.object({
    text: yup.string().default(""),
    output: yup.object().default(undefined),
});