/**
 * interfaces and node data schema
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import * as yup from "yup";
import { NodeProps } from "reactflow";


export interface LLMFunctionCallNodeProps extends NodeProps {
    data: {
        model: string,
        parameters: {
            max_token: number,
            temperature: number,
            top_k: number,
            top_p: number,
            penalty: number,
        },
        functions: {
            name: string,
            description: string,
            properties: {
                name: string,
                type: string,
                description?: string,
                enum?: string[],
                required: boolean,
            }[]
        }[],
        output?: {
            function?: {
                name: string,
                arguments: { [key: string]: any }
            }
        },

        state: false | "pending" | "completed",
    }
}

const parametersSchema = yup.object().shape({
    max_token: yup.number().required().default(128),
    temperature: yup.number().required().default(0.5),
    top_p: yup.number().required().default(0.5),
    top_k: yup.number().required().default(50),
    penalty: yup.number().required().default(1),
})

export const functionPropsSchema = yup.object().shape({
    name: yup.string().required().default(""),
    type: yup.string().required().default(""),
    description: yup.string().required().default(""),
    required: yup.boolean().default(true)
})

export const functionsSchema = yup.object().shape({
    name: yup.string().required().default(""),
    description: yup.string().required().default(""),
    properties: yup.array().of(functionPropsSchema),
})

export const schema = yup.object({
    model: yup.string().required().default("llama3-ffm-70b-chat"),
    parameters: parametersSchema,
    functions: yup.array().of(functionsSchema).default([]),
    output: yup.object().default(undefined),
    state: yup.boolean().default(false),
});