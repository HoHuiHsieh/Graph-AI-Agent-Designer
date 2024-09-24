/**
 * interfaces and node data schema
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { NodeProps } from "reactflow";
import * as yup from "yup";
import { Message } from "../typedef";


export interface TextfieldSystNodeProps extends NodeProps {
    data: {
        text: string,
        output?: {
            system: (Message & { role: "system" })[]
        },
    }
}


export const schema = yup.object({
    text: yup.string().default(""),
    output: yup.object().default(undefined),
});