/**
 * interfaces and node data schema
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { NodeProps } from "reactflow";
import * as yup from "yup";
import { Message } from "../typedef";


export interface TextFileSystNodeProps extends NodeProps {
    data: {
        filename: string,
        content: string,
        output?: {
            system: (Message & { role: "system" })[]
        },
    }
}


export const schema = yup.object({
    filename: yup.string().required().default(""),
    content: yup.string().required().default(""),
    output: yup.object().default(undefined),
});