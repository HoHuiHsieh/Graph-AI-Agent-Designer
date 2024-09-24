/**
 * add node component
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React from "react";
import { Divider, TextField, Typography } from "@mui/material";
import BaseNode from "../BaseNode";
import { NodeHandleProps } from "../BaseNode";
import { getConnectionHandlePosition } from "../utils";
import { RAGCheckOutputNodeProps } from "./typedef";
import Main from ".";


/**
 * RAG check output node
 * @param props 
 * @returns 
 */
export default function RAGCheckOutputNode(props: RAGCheckOutputNodeProps): React.ReactNode {
    // Add connection handler
    let p0 = getConnectionHandlePosition(1, 0);
    const handles: NodeHandleProps[] = [
        { type: "target", datatype: "assistant", shift: p0, id: "assistant", maxConnections: 1 },
    ]
    const data = props.data;
    const isValid = Boolean(
        data?.id &&
        data?.model &&
        data?.documents.some(e => e) &&
        data.parameters?.chunkOverlap &&
        data.parameters?.chunkSize &&
        data.parameters?.separator &&
        data.parameters?.num_retrieve &&
        !data.documents.some(e => !e.text)
    );

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
                    value={`${props.data.model} (${props.data.documents.length})`}
                    slotProps={{
                        inputLabel: {
                            style: { fontWeight: 800, }
                        },
                        htmlInput: {
                            style: {
                                fontWeight: 800,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                
                            },
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
