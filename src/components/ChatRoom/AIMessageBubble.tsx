/**
 * @fileoverview AI Message Bubble component for displaying AI messages in a chat interface.
 * 
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React from "react";
import { Box, Typography, Stack, Paper, useTheme } from "@mui/material";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";


interface AIMessageBubbleProps {
    content: string;
    completion_tokens: number;
}
/**
 * AIMessageBubble component renders a message bubble for AI responses in the chat interface.
 * @param param0 
 * @returns 
 */
export default function AIMessageBubble({ content, completion_tokens }: AIMessageBubbleProps) {
    const theme = useTheme();
    return (
        <Box
            width="100%"
            display="flex"
            justifyContent="flex-start"
        >
            <Paper
                elevation={1}
                sx={{
                    backgroundColor: theme.palette.secondary.light,
                    padding: 1,
                    borderRadius: 1,
                    width: "fit-content",
                    maxWidth: "80%",
                    marginRight: "auto",
                }}
                component={Box}
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
                        // color={theme.palette.secondary.contrastText}
                        component="span"
                        fontSize={28}
                    >
                        <Markdown remarkPlugins={[remarkGfm]}>
                            {content}
                        </Markdown>
                    </Typography>
                    <Typography
                        variant="caption"
                        // color={theme.palette.secondary.contrastText}
                        sx={{
                            fontSize: "0.75rem",
                            fontStyle: "italic",
                            textAlign: "right",
                        }}
                    >
                        {`${completion_tokens || "???"} tokens`}
                    </Typography>
                </Stack>
            </Paper>
        </Box>
    );
}