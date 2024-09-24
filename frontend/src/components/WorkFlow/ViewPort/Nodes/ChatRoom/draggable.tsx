/**
 * add draggable item
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React from "react";
import { BoxProps } from "@mui/material";
import Draggable from "../BaseNode/Draggable";
import Main from ".";


/**
 * draggable chatroom item
 * @param props
 * @returns
 */
export default function ChatRoomDraggable(props: BoxProps): React.ReactNode {
    return (
        <Draggable {...props}
            label={Main.label}
            input={["assistant"]}
            output={[]}
        />
    )
}