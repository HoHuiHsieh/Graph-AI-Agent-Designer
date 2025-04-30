/**
 * @fileoverview AI Message Bubble component for displaying AI messages in a chat interface.
 * 
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React from "react";
import { Box, Typography, Stack, Paper, useTheme, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";


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
    const isThinking = [
        content.trimStart().startsWith("<think>"),
        content.trimStart().startsWith("<step>"),
        content.trimStart().startsWith("<verify>")
    ].some(e => e);

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
                    {isThinking ? (
                        <ThinkAndStepContent content={content} />
                    ) : (
                        <AnswerContent content={content} />
                    )}

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


/**
 * ThinkAndStepContent component renders the content of the AI message bubble when it is in a thinking or step state.
 * @param param0 
 * @returns 
 */
function ThinkAndStepContent({ content }: { content: string }) {
    const theme = useTheme();

    const summary = content.trimStart().startsWith("<think>")
        ? "Thinking..."
        : content.trimStart().startsWith("<step>")
            ? "Thinking..."
            : content.trimStart().startsWith("<verify>")
                ? "Verifying..."
                : "Details";

    const processedContent = content.replace(/^(<think>|<step>|<verify>)/, "").trim();

    return (
        <Accordion defaultExpanded
            square={true}
            sx={{
                borderRadius: 10,
                backgroundColor: theme.palette.background.paper,
            }}
        >
            <AccordionSummary expandIcon={<ExpandMore />} >
                <Typography component="span" noWrap overflow="hidden" textOverflow="ellipsis">
                    {summary}
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Markdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                >
                    {processedContent}
                </Markdown>
            </AccordionDetails>
        </Accordion>
    )
}

/**
 * AnswerContent component renders the content of the AI message bubble when it is in a normal state.
 * @param param0 
 * @returns 
 */
function AnswerContent({ content }: { content: string }) {
    const theme = useTheme();
    return (
        <Typography
            variant="body1"
            // color={theme.palette.secondary.contrastText}
            component="span"
            fontSize={24}
        >
            <Markdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
            >
                {content}
            </Markdown>
        </Typography>
    )
}