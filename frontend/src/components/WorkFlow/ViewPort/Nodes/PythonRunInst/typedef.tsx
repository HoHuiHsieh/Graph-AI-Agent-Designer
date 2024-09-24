/**
 * interfaces and node data schema
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { NodeProps } from "reactflow"
import { Message } from "../typedef"
import * as yup from "yup";


export interface PythonRunInstNodeProps extends NodeProps {
    data: {
        code: string,
        env: string,
        output?: {
            instruction: (Message & { role: "user" | "assistant" })[]
        },
        state: false | "pending" | "completed",
    }
}


export const schema = yup.object({
    code: yup.string().default(""),
    env: yup.string().default("default"),
    output: yup.object().default(undefined),
    state: yup.boolean().default(false),
});
