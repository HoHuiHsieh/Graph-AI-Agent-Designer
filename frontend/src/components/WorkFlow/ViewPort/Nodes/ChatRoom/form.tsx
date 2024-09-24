/**
 * add toolbox component
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useState, useRef, useCallback, useEffect } from "react";
import { Backdrop, Box, CircularProgress, IconButton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { ClearAll, Fullscreen, FullscreenExit, Mic, MicOff, Send, Undo } from "@mui/icons-material";
import { Edge, Node, useReactFlow } from "reactflow";
import { useFormik } from "formik";
import webSocket from "socket.io-client";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { useWorkSpace } from "@/components/WorkFlow/provider";
import { ChatDialog } from "@/components/WorkFlow/typedef";
import GetSpeech from "@/api/GetSpeech";
import { ChatRoomNodeProps, schema } from "./typedef";
import { UserDialog, BotDialog, ImageDialog, VideoDialog } from "./dialog";
import { ChatRoomAPINodeProps } from "../ChatRoomAPI/typedef";
import Main from ".";


// connect to websocket server
const socket = webSocket("/", { transports: ["websocket"], });

/**
 * chatroom component
 * @param props 
 * @returns 
 */
export default function ChatRoomForm(props: Node & { label?: string, data: ChatRoomNodeProps["data"] }): React.ReactNode {
    const { loading, setLoading, dialogs, setDialogs, dialogWidth, setDialogWidth } = useWorkSpace();
    const { setNodes, setEdges, getNodes, getEdges } = useReactFlow();
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [prompt, setPrompt] = useState<string>("")

    // handle chat input
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const keyPress: React.KeyboardEventHandler<HTMLDivElement> = (e) => {

        if (["Enter", "NumpadEnter"].includes(e.code) && e.ctrlKey) {
            buttonRef.current?.click()
        }
    }

    // handle state
    const formik = useFormik<ChatRoomNodeProps["data"]>({
        initialValues: {
            ...schema.getDefault(),
            ...(props.data || {})
        },
        validationSchema: schema,
        onSubmit: () => { },
    });

    useEffect(() => {
        return () =>
            setNodes((nodes) => {
                // change node value
                const index = nodes.findIndex((e) => e.id == props.id);
                if (index > -1) {
                    nodes[index].data = formik.values;
                }
                return nodes;
            });
    }, [setNodes]);

    // handle clear 
    const handleClear = useCallback(() => {
        formik.setFieldValue("output", { assistant: [] });
        setDialogs([]);
        setNodes((nodes) => {
            return nodes.map((node) => {
                if ("state" in node.data && "output" in node.data) {
                    return { ...node, data: { ...node.data, output: undefined } }
                }
                return node
            })
        })
    }, [formik, setDialogs, setNodes])

    // handle undo 
    const handleUndo = useCallback(() => {
        setDialogs((assistant) => {
            let dialog = assistant.pop();
            while (dialog?.role === "assistant") {
                dialog = assistant.pop();
                if (assistant.length === 0) {
                    break
                }
            }
            formik.setFieldValue("output", { assistant });
            return assistant
        })
    }, [formik, setDialogs])

    // handle submit
    const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = useCallback((event) => {
        event?.preventDefault();

        // check has value
        if (!prompt.trim()) { return }
        setLoading(true);

        // add user prompt to dialogs
        let beforeExecudeDialogs: ChatDialog[] = [...dialogs, { role: "user", content: prompt }];
        setDialogs(beforeExecudeDialogs);

        // 
        try {
            let nodes = getNodes();
            let index = nodes.findIndex(e => e.type === "EntryPoint");
            if (index < 0) { throw new Error("Failed to find EntryPoint.") }
            nodes[index].data = {
                ...nodes[index].data,
                output: {
                    prompt: beforeExecudeDialogs.filter(e => ["user", "assistant"].includes(e.role))
                }
            }

            // send request
            if (isConnected) {
                const edges = getEdges();
                socket.send(JSON.stringify({ nodes, edges }));
            } else {
                alert("Server not connected!")
            }
        } catch (error) {
            console.error(error);
            alert(JSON.stringify(error));
            handleUndo();
        } finally {
            setLoading(false)
        }
    }, [prompt, dialogs, getNodes, getEdges, setLoading, handleUndo]);

    // handle submit with recorder
    const recorderControls = useAudioRecorder()
    const addAudioElement = async (blob: Blob) => {
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const getSpeech = new GetSpeech();
        const text = await getSpeech.asr(buffer);
        setPrompt(text);
    };

    // handle scroll
    const scrollRef = useRef<HTMLElement>(null);
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, []);

    // initialize connection
    useEffect(() => {
        function onConnect() {
            console.log("connect", socket.id);
            setIsConnected(true)
        }

        function onDisconnect() {
            console.log("disconnect", socket.id);
            setIsConnected(false)
        }

        function onMessage(response: any) {
            const { data, progress, error, elapsed_time } = JSON.parse(response) as {
                data?: { nodes: Node[], edges: Edge[] },
                progress?: number | "completed",
                error?: string,
                elapsed_time: number
            };
            if (error) {
                console.error(error);
                alert(error);
                setLoading(false);
                handleUndo();
            }
            if (data) {
                setNodes(data.nodes);
                setEdges(data.edges);
            }
            if (typeof progress === "number") {
                setLoading(progress);
            }
            if (data && progress === "completed") {
                try {
                    // check final results
                    let chatRoomNode = data.nodes.find(e => e.id === props.id);
                    if (!chatRoomNode) { throw new Error("ChatRoomNode not found") }
                    let chatRoomOutput: ChatRoomNodeProps["data"]["output"] = chatRoomNode.data.output;

                    let botDialog = (chatRoomOutput?.assistant || []).pop();
                    if (!botDialog) { throw new Error("Failed to get assistant.") }
                    if (botDialog?.role !== "assistant") { throw new Error("Failed on role of dialogs.") }
                    botDialog.elapsed_time = elapsed_time;

                    // update dialogs
                    setDialogs((dialogs) => {
                        // bot response
                        let afterExecudeDialogs = [...dialogs, botDialog];

                        // insert function call response
                        data.nodes.filter(e => e.type === "ChatRoomAPI").forEach((node) => {
                            let nodeData: ChatRoomAPINodeProps["data"] = node.data;
                            switch (nodeData.output?.function?.name) {
                                case "resetChat":
                                    handleClear()
                                    alert("Reset current chat")
                                    return;

                                case "showImage":
                                    afterExecudeDialogs = [...afterExecudeDialogs, {
                                        role: "image",
                                        content: JSON.stringify(nodeData.output?.function || {})
                                    }]
                                    return;

                                case "showVideo":
                                    afterExecudeDialogs = [...afterExecudeDialogs, {
                                        role: "video",
                                        content: JSON.stringify(nodeData.output?.function || {})
                                    }]
                                    return;

                                default:
                                    return;
                            }
                        })
                        return afterExecudeDialogs
                    })

                } catch (error: any) {
                    console.error(error);
                    let msg = error?.message || JSON.stringify(error);
                    alert(msg);
                    handleUndo();
                } finally {
                    setPrompt("");
                    setLoading(false)
                }

            }
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("message", onMessage);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("message", onMessage);
        };
    }, [setNodes, setEdges, setLoading, setDialogs, setPrompt, handleUndo, handleClear]);

    return (
        <div
            style={{
                display: "block",
                width: "100%",
                height: "100%",
                // borderSpacing: 1,
                backgroundColor: "#111111"
            }}
        >
            <Typography
                variant="h3"
                textAlign="center"
                color="#FFF"
                p={1}
            >
                {Main.title}
                <Tooltip placement="left-end" title="全螢幕">
                    <IconButton
                        onClick={() => setDialogWidth((w) => {
                            if (w >= 50) { return 30 }
                            else { return 99 }
                        })}
                        style={{
                            position: "absolute",
                            right: 0,
                            marginRight: 8
                        }}>
                        {dialogWidth >= 99 ?
                            <FullscreenExit style={{ fill: "#fff" }} /> :
                            <Fullscreen style={{ fill: "#fff" }} />
                        }
                    </IconButton>
                </Tooltip>
            </Typography>
            <Box
                ref={scrollRef as React.RefObject<HTMLDivElement>}
                sx={{
                    height: "64vh",
                    margin: 1,
                    marginTop: 0,
                    padding: 1,
                    border: 1,
                    borderRadius: 1,
                    backgroundColor: "#2A2A2A",
                    overflow: "auto",
                    overflowY: "scroll",
                }}
            >
                <Stack
                    direction="column"
                    justifyContent="flex-start"
                    alignItems="stretch"
                    spacing={2}
                >
                    {
                        dialogs.map((dialog, index) => {
                            switch (dialog.role) {
                                case "user":
                                    return (
                                        <UserDialog key={index} value={dialog} />
                                    );

                                case "assistant":
                                    return (
                                        <BotDialog key={index} value={dialog} />
                                    );

                                case "image":
                                    return (
                                        <ImageDialog key={index} value={dialog} />
                                    )

                                case "video":
                                    return (
                                        <VideoDialog key={index} value={dialog} />
                                    )

                                default:
                                    return <div key={index}></div>;
                            }
                        })
                    }
                </Stack>
            </Box>
            <Box sx={{
                height: "5vh",
                margin: 1,
                padding: 0,
            }}>
                <TextField
                    fullWidth
                    multiline
                    rows={5}
                    InputProps={{
                        style: {
                            color: "#FFFFFF",
                            backgroundColor: "#383838",
                        },
                        endAdornment: (
                            <Stack
                                direction="row"
                                justifyContent="flex-end"
                                alignItems="center"
                                spacing={0}
                            >
                                <IconButton
                                    ref={buttonRef}
                                    color="primary"
                                    onClick={handleSubmit}
                                    disabled={loading !== false}
                                    size="small"
                                >
                                    <Send fontSize="large" style={{ color: "#949494" }} />
                                </IconButton>
                                <AudioRecorder
                                    onRecordingComplete={(blob) => addAudioElement(blob)}
                                    recorderControls={recorderControls}
                                    downloadFileExtension="wav"
                                    mediaRecorderOptions={{
                                        audioBitsPerSecond: 16000,
                                    }}
                                />
                            </Stack>
                        ),
                    }}
                    variant="outlined"
                    name="prompt"
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    onKeyDown={keyPress}
                />
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="stretch"
                    spacing={1}
                >
                    <Tooltip title="清空" placement="top" >
                        <IconButton
                            onClick={() => handleClear()}
                            style={{ width: "50%" }}
                        >
                            <ClearAll fontSize="large" style={{ color: "#949494" }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="復原" placement="top" >
                        <IconButton
                            onClick={() => handleUndo()}
                            style={{ width: "50%" }}
                        >
                            <Undo fontSize="large" style={{ color: "#949494" }} />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Box>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading !== false}
            >
                <CircularProgress color="inherit" value={Number(loading)} />
            </Backdrop>
        </div >
    )
}
