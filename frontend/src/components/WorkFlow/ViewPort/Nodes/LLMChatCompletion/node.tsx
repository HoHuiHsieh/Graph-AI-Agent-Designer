/**
 * add node component
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React from "react";
import { TextField, Typography } from "@mui/material";
import BaseNode from "../BaseNode";
import { NodeHandleProps } from "../BaseNode";
import { getConnectionHandlePosition } from "../utils";
import { LLMChatCompletionNodeProps } from "./typedef";
import Main from ".";
import { useWorkSpace } from "@/components/WorkFlow/provider";


/**
 * LLM chat completion node
 * @param props 
 * @returns 
 */
export default function LLMChatCompletionNode(props: LLMChatCompletionNodeProps): React.ReactNode {
    const { options } = useWorkSpace();

    // Add connection handler
    let p0 = getConnectionHandlePosition(3, 0),
        p1 = getConnectionHandlePosition(3, 1),
        p2 = getConnectionHandlePosition(3, 2),
        p3 = getConnectionHandlePosition(1, 0);
    const handles: NodeHandleProps[] = [
        { type: "target", datatype: "system", shift: p2, id: "system", maxConnections: 100 },
        { type: "target", datatype: "instruction", shift: p1, id: "instruction", maxConnections: 100 },
        { type: "target", datatype: "prompt", shift: p0, id: "prompt", maxConnections: 1 },
        { type: "source", datatype: "assistant", shift: p3, id: "assistant", maxConnections: 1 },
    ]
    const isValid = Boolean(
        props.data?.model &&
        props.data.parameters?.max_token &&
        props.data.parameters?.temperature &&
        props.data.parameters?.top_p &&
        props.data.parameters?.top_k);

    return (
        <BaseNode id={props.id}
            handlers={handles}
            isValid={isValid}
            loading={Boolean(props.data?.output)}
        >
            {!props.data.model ?
                <Typography variant="h3" textAlign="center" color={isValid ? undefined : "error"} >
                    {Main.label}
                </Typography> :
                <TextField
                    label={Main.label}
                    variant="standard"
                    value={options.models.chat.find(e => e.value === props.data.model)?.label || undefined}
                    slotProps={{
                        inputLabel: {
                            style: { fontWeight: 800, }
                        },
                        htmlInput: {
                            style: { fontWeight: 800 }

                        }
                    }}
                />
            }
        </BaseNode>
    );
}
