/**
 * add node component
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React from "react";
import { Divider, Typography } from "@mui/material";
import BaseNode from "../BaseNode";
import { NodeHandleProps } from "../BaseNode";
import { EntryPointNodeProps } from "./typedef";
import Main from ".";


/**
 * entry point node
 * @param props 
 * @returns 
 */
export default function EntryPointNode(props: EntryPointNodeProps): React.ReactNode {
    // Add connection handler
    const handles: NodeHandleProps[] = [
        { type: "source", datatype: "prompt", shift: 0.5, id: "prompt", maxConnections: 1 },
    ]
    return (
        <BaseNode id={props.id}
            handlers={handles}
        >
            <Typography variant="h3" textAlign="center" >
                {Main.label}
            </Typography>
            <Divider
                absolute
                orientation="vertical"
                sx={{
                    left: "1rem",
                    background: "#aaa",
                    width: "1rem"
                }}
            />
        </BaseNode>
    );
}
