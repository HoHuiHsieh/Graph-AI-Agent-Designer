/**
 * base component of draggable item
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React from "react";
import { Box, BoxProps, styled, Tooltip, Typography } from "@mui/material";
import { ArrowRight, Square } from "@mui/icons-material";


interface DraggableProps extends BoxProps {
    label: string,
    input: ("function" | "assistant" | "prompt" | "instruction" | "system")[],
    output: ("function" | "assistant" | "prompt" | "instruction" | "system")[],
}

// styled draggable box
export const DraggableBox = styled(Box)(({ theme }) => ({
    display: "flex",
    minWidth: "12rem",
    height: "2rem",
    boxSizing: "border-box",
    alignItems: "center",
    justifyContent: "center",
    padding: 1,
    color: theme.palette.common.black,
    backgroundColor: theme.palette.common.white,
    border: "1px solid",
    borderRadius: 4,
    borderColor: theme.palette.primary.dark,
}))


/**
 * draggable component
 * @param props 
 * @returns 
 */
export default function Draggable(props: DraggableProps): React.ReactNode {
    const { label, input, output } = props;
    return (
        <DraggableBox {...props} >
            <InputOutputLabel handlers={input} pos="left" />
            <Typography variant="h5" noWrap>
                {label}
            </Typography>
            <InputOutputLabel handlers={output} pos="right" />
        </DraggableBox>
    )
}

/**
 * 
 * @param props 
 * @returns 
 */
function InputOutputLabel(props: {
    handlers: ("function" | "assistant" | "prompt" | "instruction" | "system")[],
    pos: "left" | "right"
}): React.ReactNode {
    const { handlers, pos } = props;
    if (handlers.length === 0) {
        return <Box
            display="flex"
            alignItems="center"
            justifyContent={pos === "right" ? "flex-start" : "flex-end"}
            width="5em"
        />
    }

    const handler = (role: string, index: number) => {
        switch (role) {
            case "system":
                return (
                    <Tooltip key={index}
                        title={(
                            <Typography variant="caption">
                                system prompt
                            </Typography>
                        )}>
                        <Square fontSize="small" style={{ fill: "#FF00BD" }} />
                    </Tooltip>
                );

            case "instruction":
                return (
                    <Tooltip key={index}
                        title={(
                            <Typography variant="caption">
                                instructions
                            </Typography>
                        )}>
                        <Square fontSize="small" style={{ fill: "#F2CA19" }} />
                    </Tooltip>
                );

            case "prompt":
                return (
                    <Tooltip key={index}
                        title={(
                            <Typography variant="caption">
                                user prompt
                            </Typography>
                        )}>
                        <Square fontSize="small" style={{ fill: "#0057E9" }} />
                    </Tooltip>
                );

            case "assistant":
                return (
                    <Tooltip key={index}
                        title={(
                            <Typography variant="caption">
                                bot response
                            </Typography>
                        )}>
                        <Square fontSize="small" style={{ fill: "#0af5f5" }} />
                    </Tooltip>
                );

            case "function":
                return (
                    <Tooltip key={index}
                        title={(
                            <Typography variant="caption">
                                call function
                            </Typography>
                        )}>
                        <Square fontSize="small" style={{ fill: "#87E911" }} />
                    </Tooltip>
                );

            default:
                return <></>
        }
    }
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent={pos === "right" ? "flex-start" : "flex-end"}
            width="5em"
        >
            {pos === "right" && <ArrowRight fontSize="small" />}
            {handlers.map((role, index) => handler(role, index))}
            {pos === "left" && <ArrowRight fontSize="small" />}
        </Box>
    )
}