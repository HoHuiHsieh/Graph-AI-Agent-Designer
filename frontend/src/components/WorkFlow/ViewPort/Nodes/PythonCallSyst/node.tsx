/**
 * add node component
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useEffect } from "react";
import { TextField, Typography } from "@mui/material";
import { useReactFlow, Node, getIncomers } from "reactflow";
import BaseNode from "../BaseNode";
import { NodeHandleProps } from "../BaseNode";
import { PythonCallSystNodeProps } from "./typedef";
import { getConnectionHandlePosition } from "../utils";
import { LLMFunctionCallNodeProps } from "../LLMFunctionCall/typedef";
import Main from ".";
import { RAGSimpleFuncNodeProps } from "../RAGSimpleFunc/typedef";


/**
 * Python function call node
 * @param props 
 * @returns 
 */
export default function PythonCallSystNode(props: PythonCallSystNodeProps): React.ReactNode {
    const { setNodes, getEdges, getNodes, getNode } = useReactFlow();

    // insert templete if no code
    useEffect(() => {
        if (!props.data?.code) {
            const thisNode = getNode(props.id),
                nodes = getNodes(),
                edges = getEdges();
            if (!thisNode) { return }
            const sources = getIncomers(thisNode, nodes, edges);
            setNodes((state) => {
                let index = state.findIndex(e => e.id == props.id),
                    code = defaultCode(sources);
                state[index].data = { ...state[index].data, code };
                return state
            })
        }
    }, [props.data.code, getNode, getNodes, getEdges, setNodes])


    // Add connection handler
    let p0 = getConnectionHandlePosition(1, 0);
    const handles: NodeHandleProps[] = [
        { type: "target", datatype: "function", shift: p0, id: "function", maxConnections: 100 },
        { type: "source", datatype: "system", shift: p0, id: "system", maxConnections: 100},
    ]
    const isValid = Boolean(props.data.code) && Boolean(props.data.env);
    return (
        <BaseNode id={props.id}
            handlers={handles}
            isValid={isValid}
            loading={Boolean(props.data?.output)}
        >
            {!props.data.code ?
                <Typography variant="h3" textAlign="center" color={isValid ? undefined : "error"} >
                    {Main.label}
                </Typography> :
                <TextField
                    label={Main.label}
                    variant="standard"
                    value={props.data.code}
                    slotProps={{
                        inputLabel: {
                            style: { fontWeight: 800, }
                        },
                        htmlInput: {
                            style: {
                                fontWeight: 800,
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                            }
                        }
                    }}
                />
            }
        </BaseNode>
    );
}

/**
 * 
 * @param sources 
 * @returns 
 */
const defaultCode = (sources: Node[]): string => {

    const default_llm_code = (func: any) => {
        let code = "";
        let c_args = (func?.properties || []).map((p: any) => p.name).join(", ");
        code += `def ${func?.name || "unknown"}(${c_args}):\n`;
        code += `\t"""\n`
        code += `\n\tParameters:\n`;
        (func?.properties || []).forEach((p: any) => {
            code += `\t - ${p.name} (${p.type})\n`;
        })
        code += `\n\tReturn: string\n`;
        code += `\t"""\n`;
        code += `\tpass\n\n`
        return code
    }

    const default_rag_code = (func: any) => {
        let code = "";
        let args = Object.keys(func?.arguments || {});
        let c_args = args.join(", ");
        code += `def ${func?.name || "unknown"}(${c_args}):\n`;
        code += `\t"""\n`
        code += `\n\tParameters:\n`;
        args.forEach((key: string) => {
            code += `\t - ${key}\n`;
        })
        code += `\n\tReturn: string\n`;
        code += `\t"""\n`;
        code += `\tpass\n\n`
        return code
    }

    return sources.reduce((code, s) => {
        // LLM function call
        if (s.type == "LLMFunctionCall") {
            let llm_data = s.data as LLMFunctionCallNodeProps["data"];
            for (let index = 0; index < (llm_data?.functions || []).length; index++) {
                const func = (llm_data?.functions || [])[index];
                code += default_llm_code(func)
            }
        }
        // RAG functions
        if (s.type == "RAGSimpleFunc") {
            let rag_data = s.data as RAGSimpleFuncNodeProps["data"]
            for (let index = 0; index < (rag_data?.documents || []).length; index++) {
                const func = (rag_data?.documents || [])[index];
                try {
                    code += default_rag_code(JSON.parse(func.function))
                } catch (error) {
                }
            }
        }
        return code
    }, "")
}