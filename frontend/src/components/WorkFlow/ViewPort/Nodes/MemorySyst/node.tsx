/**
 * add node component
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React from "react";
import { Typography } from "@mui/material";
import BaseNode from "../BaseNode";
import { NodeHandleProps } from "../BaseNode";
import { MemorySystNodeProps } from "./typedef";
import Main from ".";


/**
 * Short memory node
 * @param props 
 * @returns 
 */
export default function MemorySystNode(props: MemorySystNodeProps): React.ReactNode {
    // Add connection handler
    const handles: NodeHandleProps[] = [
        { type: "source", datatype: "system", shift: 0.5, id: "system", maxConnections: 100 },
        { type: "target", datatype: "system", shift: 0.5, id: "system", maxConnections: 100 },
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
