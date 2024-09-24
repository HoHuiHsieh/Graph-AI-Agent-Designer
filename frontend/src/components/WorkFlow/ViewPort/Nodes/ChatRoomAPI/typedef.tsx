/**
 * interfaces and node data schema
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { NodeProps } from "reactflow";
import * as yup from "yup";
import { Message } from "../typedef";


export interface ChatRoomAPIs {
    resetChat: {
        label: string,
        checked: boolean,
    },
    showImage: {
        label: string,
        checked: boolean,
    },
    showVideo: {
        label: string,
        checked: boolean,
    },
}

export interface ChatRoomAPINodeProps extends NodeProps {
    data: {
        functions: {
            name: string,
        }[],
        apis: {
            [func: string]: ChatRoomAPIs,
        },
        output?: {
            instruction: (Message & { role: "user" | "assistant" })[],
            function?: {
                name: string,
                arguments: { [key: string]: any }
            }
        },
        
        state: false | "pending" | "completed",
    }
}

const funcSchema = yup.object().shape({
    name: yup.string().required().default(""),
})

const apiPropsSchema = yup.object().shape({
    label: yup.string(),
    checked: yup.boolean(),
})

export const apiSchema = yup.object().shape({
    resetChat: apiPropsSchema.default({
        label: "Reset Chatroom",
        checked: false,
    }),
    showImage: apiPropsSchema.default({
        label: "Show image('src' argument is required)",
        checked: false,
    }),
    showVideo: apiPropsSchema.default({
        label: "Play video('src' argument is required)",
        checked: false,
    }),
})


export const schema = yup.object({
    functions: yup.array().of(funcSchema).default([]),
    apis: yup.lazy((value) => {
        const entries = Object.keys(value || {}).reduce((acc, val) => ({
            ...acc,
            [val]: apiSchema,
        }), {})
        return yup.object().shape(entries)
    }),
    output: yup.object().default(undefined),
    state: yup.boolean().default(false),
});

