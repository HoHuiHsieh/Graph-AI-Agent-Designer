/**
 * add node component
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React from "react";
import { Typography } from "@mui/material";
import BaseNode from "../BaseNode";
import { NodeHandleProps } from "../BaseNode";
import { getConnectionHandlePosition } from "../utils";
import { ChatRoomAPINodeProps } from "./typedef";
import Main from ".";


/**
 * chatroom-api node
 * @param props 
 * @returns 
 */
export default function ChatRoomAPINode(props: ChatRoomAPINodeProps): React.ReactNode {
    // Add connection handler
    let p0 = getConnectionHandlePosition(1, 0);
    const handles: NodeHandleProps[] = [
        { type: "target", datatype: "function", shift: p0, id: "function", maxConnections: 100 },
        { type: "source", datatype: "instruction", shift: 0.5, id: "instruction", maxConnections: 100 },
    ]
    const isValid = Boolean(props.data);

    return (
        <BaseNode id={props.id}
            handlers={handles}
            isValid={isValid}
            loading={false}
        >
            <Typography variant="h3" textAlign="center" color={isValid ? undefined : "error"} >
                {Main.label}
            </Typography>
        </BaseNode>
    );
}
