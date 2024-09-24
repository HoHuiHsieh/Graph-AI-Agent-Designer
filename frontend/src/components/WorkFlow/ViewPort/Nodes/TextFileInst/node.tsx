/**
 * add node component
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React from "react";
import { TextField, Typography } from "@mui/material";
import BaseNode from "../BaseNode";
import { NodeHandleProps } from "../BaseNode";
import { TextFileInstNodeProps } from "./typedef";
import Main from ".";


/**
 * text file node
 * @param props 
 * @returns 
 */
export default function TextFileInstNode(props: TextFileInstNodeProps): React.ReactNode {
    // Add connection handler
    const handles: NodeHandleProps[] = [
        { type: "source", datatype: "instruction", shift: 0.5, id: "instruction", maxConnections: 100 },
    ]
    const isValid = Boolean(props.data.filename);
    return (
        <BaseNode
            id={props.id}
            handlers={handles}
            isValid={isValid}
        >
            {!props.data.content ?
                <Typography variant="h3" textAlign="center" color={isValid ? undefined : "error"} >
                    {Main.label}
                </Typography> :
                <TextField
                    label={Main.label}
                    variant="standard"
                    value={props.data.content}
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
