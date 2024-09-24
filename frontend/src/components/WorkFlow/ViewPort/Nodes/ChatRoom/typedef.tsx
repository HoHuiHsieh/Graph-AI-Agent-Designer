/**
 * interfaces and node data schema
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { NodeProps } from "reactflow";
import * as yup from "yup";
import { ChatDialog } from "@/components/WorkFlow/typedef";


export interface ChatRoomNodeProps extends NodeProps {
    data: {
        output?: {
            assistant: ChatDialog[]
        },
        state: false | "pending" | "completed",
    }
}


export interface ChatRoomNode extends Node {
    data: ChatRoomNodeProps["data"]
}


export interface DialogBox {
    value: ChatDialog,
}


export interface ImageBox {
    value: ChatDialog,
}


// schema for node.data
export const schema = yup.object({
    output: yup.object().default(undefined),
    state: yup.boolean().default(false),
});

