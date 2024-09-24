/**
 * interfaces and node data schema
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import * as yup from "yup";
import { NodeProps } from "reactflow"
import { Message } from "../typedef"


export interface PythonCallSystNodeProps extends NodeProps {
    data: {
        code: string,
        env: string,
        output?: {
            system: (Message & { role: "system" })[]
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
