/**
 * @fileoverview Human Message Bubble component for displaying user messages in a chat interface.
 * 
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React from "react";
import { Box, Typography, Stack, Paper, useTheme } from "@mui/material";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";


interface HumanMessageBubbleProps {
    content: string;
}

/**
 * HumanMessageBubble component renders a message bubble for user messages in the chat interface.
 * It displays the message content in a styled bubble format.
 * @param param0 
 * @returns 
 */
export default function HumanMessageBubble({ content }: HumanMessageBubbleProps) {
    const theme = useTheme();
    return (
        <Box
            width="100%"
            display="flex"
            justifyContent="flex-end"
        >
            <Paper
                elevation={1}
                sx={{
                    backgroundColor: theme.palette.primary.light,
                    padding: 1,
                    borderRadius: 1,
                    width: "fit-content",
                    maxWidth: "80%",
                    marginLeft: "auto",
                    justifyContent: "flex-end",
                }}
            >
                <Stack
                    direction="column"
                    spacing={2}
                    sx={{
                        justifyContent: "flex-start",
                        alignItems: "stretch",
                    }}
                >
                    <Typography
                        variant="body1"
                        color={theme.palette.primary.contrastText}
                        component="span"
                        fontSize={28}
                    >
                        <Markdown remarkPlugins={[remarkGfm]}>
                            {content}
                        </Markdown>
                    </Typography>
                </Stack>
            </Paper>
        </Box>

    )
}
