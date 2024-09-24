/**
 * interfaces and node data schema
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { NodeProps } from "reactflow";
import { Message } from "../typedef";


export interface EntryPointNodeProps extends NodeProps {
    data: {
        output?: {
            prompt: (Message & { role: "user" | "assistant" })[]
        },
    }
}
