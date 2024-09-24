/**
 * add draggable item
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React from "react";
import { BoxProps } from "@mui/material";
import Draggable from "../BaseNode/Draggable";
import Main from ".";

/**
 * draggable text file item in toolbox
 * @param props
 * @returns
 */
export default function TextFileInstDraggable(props: BoxProps): React.ReactNode {

    return (
        <Draggable {...props}
            label={Main.label}
            input={[]}
            output={["instruction"]}
        />
    )
}