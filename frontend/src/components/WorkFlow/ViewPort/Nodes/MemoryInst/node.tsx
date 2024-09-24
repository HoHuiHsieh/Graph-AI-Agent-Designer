/**
 * add node component
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React from "react";
import { Typography } from "@mui/material";
import BaseNode from "../BaseNode";
import { NodeHandleProps } from "../BaseNode";
import { MemoryInstNodeProps } from "./typedef";
import Main from ".";


/**
 * Short memory node
 * @param props 
 * @returns 
 */
export default function MemoryInstNode(props: MemoryInstNodeProps): React.ReactNode {
    // Add connection handler
    const handles: NodeHandleProps[] = [
        { type: "source", datatype: "instruction", shift: 0.5, id: "instruction", maxConnections: 100 },
        { type: "target", datatype: "instruction", shift: 0.5, id: "instruction", maxConnections: 100 },
    ]
    return (
        <BaseNode
            id={props.id}
            handlers={handles}
            isValid={true}
        >
            <Typography variant="h3" textAlign="center" >
                {Main.label}
            </Typography>
        </BaseNode>
    );
}
