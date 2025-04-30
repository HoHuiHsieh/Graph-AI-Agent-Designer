/**
 * @fileoverview This file contains the Messenger component, which is used to handle chat interactions and workflows.
 * 
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useCallback } from "react";
import { Box, IconButton, Tooltip, Stack, TextField, useTheme } from "@mui/material";
import { ClearAll, Send, StopCircle } from "@mui/icons-material";
import { useReactFlow } from "reactflow";
import { cleanMemory, addCredentials, addEdges, addNodes, abortStream, stream, clearGraph } from "../LangGraph";
import { usePanel } from "../provider";
import { DATA_TYPES } from "../../types/nodes";
import AIMessageBubble from "./AIMessageBubble";
import HumanMessageBubble from "./HumanMessageBubble";


interface MessengerProps {

}

/**
 * Messenger component for handling chat interactions and workflows.
 * It manages the input field, message bubbles, and the loading state.
 * @param param0 
 * @returns 
 */
export default function Messenger({ }: MessengerProps): React.ReactNode {
    const theme = useTheme();
    const { setResultData, credentials } = usePanel();
    const { getEdges, getNodes } = useReactFlow();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [receivedMessages, setReceivedMessages] = React.useState<Map<string, any>>(new Map().set("indexes", []));

    // Ref to the message bubbles stack to scroll to the bottom
    // when new messages are received
    const messageBubblesRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        if (messageBubblesRef.current) {
            messageBubblesRef.current.scrollTop = messageBubblesRef.current.scrollHeight;
        }
    }, [receivedMessages.get("indexes")]);

    // State to manage the input value
    const [input, setInput] = React.useState<string>("");

    // Function and state to manage the received messages
    // and the indexes of the messages
    const receiveChunkData = async (chunkGenerator: AsyncGenerator<string>) => {
        setLoading(true);

        const nodes = getNodes();
        const nodeNames = nodes.map((node) => node.data.name);

        try {
            let jsonData = {};
            // Process the chunks received from the stream
            for await (const chunk of await chunkGenerator) {
                // Check if the chunk is empty
                if (!chunk) {
                    console.warn("Received empty chunk");
                    continue;
                }
                console.log("Received chunk:", chunk);

                // Parse the chunk as JSON
                // and check if it is an object
                let parsedChunk: { [s: string]: any; } | ArrayLike<any>;
                try {
                    parsedChunk = JSON.parse(chunk);
                    if (typeof parsedChunk !== "object") throw new Error("Parsed chunk is not an object");
                } catch {
                    console.warn("Invalid JSON chunk, skipping...");
                    continue;
                }

                // Update the received messages state
                const entries: [string, any][] = Object.entries(parsedChunk);
                setReceivedMessages((prev) => {
                    // Update the messages map with the new entries
                    const updatedMessages = new Map(prev);

                    // Iterate over the entries and update the messages
                    entries.forEach(([key, { json, messages }]) => {
                        if (!nodeNames.includes(key) || !Array.isArray(messages)) return;

                        // Iterate over the messages and update the map
                        messages.forEach((value) => {
                            if (!value?.kwargs?.id) return;

                            // Update the message in the map
                            // and add it to the indexes if not already present
                            const id = value.kwargs.id;
                            updatedMessages.set(id, value);
                            const indexes = updatedMessages.get("indexes");
                            if (!indexes.includes(id)) {
                                updatedMessages.set("indexes", [...indexes, id]);
                            };

                            // Update the jsonData with the new data
                            // and merge it with the existing data
                            jsonData = { ...jsonData, ...(json || {}) };
                        });
                    });
                    return updatedMessages;
                });
            }

            // Update the result data with the new messages and jsonData
            // and merge it with the existing data
            setResultData((data) => ({
                json: { ...data.json, ...jsonData },
                messages: receivedMessages.get("indexes").map((key) => receivedMessages.get(key)),
            }));
        } catch (error) {
            console.error("Error processing chunk data:", error);
        } finally {
            setInput("");
            setLoading(false);
        }
    };

    // Function to handle sending the message 
    // and managing the loading state
    const handleSend = async () => {
        if (!input.trim()) return;

        // Get the nodes and edges from the ReactFlow instance
        // and find the chat node
        const nodes = getNodes();
        const edges = getEdges();
        const chatNode = nodes.find((node) => node.data.type === DATA_TYPES.CHAT);
        if (!chatNode) {
            alert("Chat node not found");
            console.error("Chat node not found");
            return;
        }

        // Set the loading state to true
        setLoading(true);

        try {
            // Clear the graph before sending the message
            await clearGraph();
            // Add nodes, edges, and credentials to the graph
            await Promise.all([addNodes(nodes), addEdges(edges), addCredentials(credentials)]);
            const chunkGenerator = stream(input.trim(), chatNode.id);
            await receiveChunkData(chunkGenerator);
        } catch (error) {
            console.error("Error sending message:", error);
            alert(`Error: ${JSON.stringify(error, null, 2)}`);
        }
    }

    // Function to handle stopping the stream
    const handleStop = async () => {
        setLoading(false);
        abortStream();
    }

    // Function to handle cleaning the memory
    const handleClear = async () => {
        // Clear server memory
        const chatNode = getNodes().find((node) => node.data.type === DATA_TYPES.CHAT);
        if (!chatNode) {
            console.error("Chat node not found");
            return;
        }
        cleanMemory(chatNode.id);

        // Clear local state
        setReceivedMessages(new Map().set("indexes", []));
        setResultData({ json: {}, messages: [] });
        setInput("");
    }

    // Function to set the end adornment of the input field
    const setEndAdornment = useCallback(() => (
        <Tooltip title={loading ? "Stop" : "Send"}>
            <IconButton onClick={loading ? handleStop : handleSend}>
                {loading ? <StopCircle color="error" fontSize="large" /> : <Send color="primary" fontSize="large" />}
            </IconButton>
        </Tooltip>
    ), [loading, handleSend, handleStop]);

    return (
        <Box
            display="flex"
            flexDirection="column"
            sx={{
                width: "100%",
                height: "100%",
                padding: 2,

            }}
        >
            {/* Message bubbles */}
            <Stack
                id="message-bubbles-stack"
                ref={messageBubblesRef}
                direction="column"
                spacing={2}
                sx={{
                    justifyContent: "flex-start",
                    alignItems: "stretch",
                    overflowY: "auto",
                    height: "70vh",
                    padding: 2,
                    backgroundColor: theme.palette.grey[100],
                }}
            >
                {receivedMessages.get("indexes").map((key: string) => {
                    const value = receivedMessages.get(key);
                    switch ((value.id || []).at(-1)) {
                        case "AIMessage":
                            return (
                                <AIMessageBubble
                                    key={key}
                                    content={value.kwargs.content}
                                    completion_tokens={value.kwargs?.response_metadata?.usage?.completion_tokens}
                                />
                            )
                        case "HumanMessage":
                            return (
                                <HumanMessageBubble
                                    key={key}
                                    content={value.kwargs.content}
                                />
                            )
                        default:
                            return null
                    }
                })}

            </Stack>

            {/* Input field */}
            <Stack
                direction="column"
                spacing={0}
                sx={{
                    justifyContent: "center",
                    alignItems: "stretch",
                    height: "fit-content",
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                }}
            >
                <TextField
                    multiline
                    fullWidth
                    focused
                    rows={3}
                    variant="outlined"
                    style={{ padding: "10px", paddingBottom: 0, fontSize: 24 }}
                    disabled={loading}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && e.shiftKey) {
                            e.preventDefault();
                            setInput((prev) => prev + "\n");
                        } else if (e.key === "Enter") {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    placeholder="Type a message"
                    slotProps={{
                        input: {
                            endAdornment: setEndAdornment(),
                            style: {
                                fontSize: 24,
                                backgroundColor: theme.palette.grey[50],
                            },
                        }
                    }}

                />
                <Tooltip title="Clear">
                    <IconButton
                        onClick={handleClear}
                        loading={loading}
                    >
                        <ClearAll color="error" fontSize="large" />
                    </IconButton>
                </Tooltip>
            </Stack>
        </Box>
    )
}

