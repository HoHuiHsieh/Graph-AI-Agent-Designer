/**
 * interfaces and node data schema
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { NodeProps } from "reactflow";
import * as yup from "yup";
import { Message } from "../typedef";


export interface RAGSimpleSystNodeProps extends NodeProps {
    data: {
        id: string,
        model: string,
        documents: {
            text: File | string,
            placeholder: string,
        }[],
        parameters: {
            chunkOverlap: number;
            chunkSize: number;
            keepSeparator: boolean;
            separator: string;
            num_retrieve: number;
            threshold: number;
        },
        output?: {
            system: (Message & { role: "system" })[]
        },
        state: false | "pending" | "completed",
    }
}


const parametersSchema = yup.object().shape({
    chunkOverlap: yup.number().required().default(0.3),
    chunkSize: yup.number().required().default(512),
    keepSeparator: yup.boolean().required().default(false),
    separator: yup.string().required().default("\\n"),
    num_retrieve: yup.number().required().default(1),
    threshold: yup.number().required().default(0.5),
})

const documentsSchema = yup.object().shape({
    text: yup.mixed().default(""),
    placeholder: yup.string().default(""),
})

export const schema = yup.object({
    id: yup.string().required().default(""),
    model: yup.string().required().default("ffm-embedding"),
    documents: yup.array().of(documentsSchema).default([{ text: "", placeholder: "" }]),
    parameters: parametersSchema,
    output: yup.object().default(undefined),
    state: yup.boolean().default(false),
});


export const seperators = [
    {
        value: "\\n",
        label: "line break(\\n)",
    },
    {
        value: ",",
        label: "comma(,)",
    },
    {
        value: "，",
        label: "comma(，)",
    },
    {
        value: ".",
        label: "period(.)",
    },
    {
        value: "。",
        label: "period(。)",
    },
    {
        value: ";",
        label: "semicolon(;)",
    },
    {
        value: "；",
        label: "semicolon(；)",
    },
    {
        value: ":",
        label: "colon(:)",
    },
    {
        value: "：",
        label: "colon(：)",
    },
]