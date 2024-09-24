/**
 * add node component
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React from "react";
import { TextField, Typography } from "@mui/material";
import BaseNode from "../BaseNode";
import { NodeHandleProps } from "../BaseNode";
import { TextfieldInstNodeProps } from "./typedef";
import Main from ".";


/**
 * textfield node
 * @param props 
 * @returns 
 */
export default function TextfieldInstNode(props: TextfieldInstNodeProps): React.ReactNode {
    // Add connection handler
    const handles: NodeHandleProps[] = [
        { type: "source", datatype: "system", shift: 0.5, id: "system", maxConnections: 100},
    ]
    const isValid = Boolean(props.data.text);
    return (
        <BaseNode
            id={props.id}
            handlers={handles}
            isValid={isValid}
        >
            {!props.data.text ?
                <Typography variant="h3" textAlign="center" color={isValid ? undefined : "error"} >
                    {Main.label}
                </Typography> :
                <TextField
                    label={Main.label}
                    variant="standard"
                    value={props.data.text}
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
