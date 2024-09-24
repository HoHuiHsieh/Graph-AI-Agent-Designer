/**
 * add node component
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React from "react";
import { Divider, Typography } from "@mui/material";
import BaseNode from "../BaseNode";
import { NodeHandleProps } from "../BaseNode";
import { ChatRoomNodeProps } from "./typedef";
import Main from ".";


/**
 * chatroom node
 * @param props 
 * @returns 
 */
export default function ChatRoomNode(props: ChatRoomNodeProps): React.ReactNode {

    // handle node info
    const [info, setInfo] = React.useState<string>("");
    React.useEffect(() => {
        setInfo(JSON.stringify(props.data, null, "\t"))
    }, [props.data])

    // Add connection handler
    const handles: NodeHandleProps[] = [
        { type: "target", datatype: "assistant", shift: 0.5, id: "assistant", maxConnections: 1 },
    ]
    return (
        <BaseNode
            id={props.id}
            handlers={handles}
            info={info}
        >
            <Typography variant="h3" textAlign="center" >
                {Main.label}
            </Typography>
            <Divider
                absolute
                orientation="vertical"
                sx={{
                    left: "13rem",
                    background: "#aaa",
                    width: "1rem"
                }}
            />
        </BaseNode>
    );
}
