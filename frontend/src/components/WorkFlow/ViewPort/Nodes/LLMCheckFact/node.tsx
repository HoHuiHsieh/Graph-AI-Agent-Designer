/**
 * add node component
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React from "react";
import { Divider, Typography,TextField } from "@mui/material";
import BaseNode from "../BaseNode";
import { NodeHandleProps } from "../BaseNode";
import { getConnectionHandlePosition } from "../utils";
import { LLMCheckFactNodeProps } from "./typedef";
import Main from ".";
import { useWorkSpace } from "@/components/WorkFlow/provider";


/**
 * LLM fact checking node
 * @param props 
 * @returns 
 */
export default function LLMCheckFactNode(props: LLMCheckFactNodeProps): React.ReactNode {
    const { options } = useWorkSpace();

    // Add connection handler
    let p0 = getConnectionHandlePosition(2, 0),
        p1 = getConnectionHandlePosition(2, 1);
    const handles: NodeHandleProps[] = [
        { type: "target", datatype: "instruction", shift: p1, id: "instruction", maxConnections: 100 },
        { type: "target", datatype: "assistant", shift: p0, id: "assistant", maxConnections: 1 },
    ]
    const data = props.data;
    const isValid = Boolean(
        data?.model &&
        data.parameters?.max_token &&
        data.parameters?.temperature &&
        data.parameters?.top_p &&
        data.parameters?.top_k);
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
            <Divider
                absolute
                orientation="vertical"
                sx={{
                    left: "13rem",
                    background: "#ddd",
                    width: "1rem"
                }}
            />
        </BaseNode>
    );
}
