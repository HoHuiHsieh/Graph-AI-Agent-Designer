/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Button, CircularProgress, Dialog, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import { ChatRoomMessage } from "@/components/Workflow/typedef";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Folder, RecordVoiceOver } from "@mui/icons-material";
import { TTSOption, tts } from "@/api/GetModel";


/**
 * 
 * @param props 
 * @returns 
 */
export default function ChatMsgs(props: { value: ChatRoomMessage[] }): React.ReactNode {
    const { value } = props;

    // handle scroll
    const scrollRef = useRef<HTMLElement>(null);
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [value])

    return (
        <Box
            ref={scrollRef as React.RefObject<HTMLDivElement>}
            height="70vh"
            margin={1}
            marginTop={0}
            padding={1}
            border={1}
            borderRadius={1}
            overflow="auto"
            sx={{ backgroundColor: "#2A2A2A" }}
        >
            <Stack
                direction="column"
                justifyContent="flex-start"
                alignItems="stretch"
                spacing={2}
            >
                <React.Fragment>
                    {value.map((msg, index) => {
                        switch (msg.role) {
                            case "system":
                                return <UserMsg key={index} value={msg} />;

                            case "user":
                                return <UserMsg key={index} value={msg} />;

                            case "assistant":
                                return <AssistMsg key={index} value={msg} />;

                            default:
                                return <></>;
                        }
                    })}
                </React.Fragment>
            </Stack>
        </Box>
    )
}


/**
 * 
 * @param props 
 * @returns 
 */
function UserMsg(props: { value: ChatRoomMessage }): React.ReactNode {
    const { value } = props;
    const { content, elapsed_time, timestamp } = value;
    return (
        <Box
            width="100%"
            display="flex"
            justifyContent="flex-end"
        >
            <Box
                display="block"
                alignContent="flex-end"
                paddingRight={.5}
                paddingBottom={0}
            >
                {timestamp &&
                    <Typography align="left" color="#777777">
                        {timestamp}
                    </Typography>
                }
                {elapsed_time &&
                    <Typography align="left" color="#777777">
                        {`${elapsed_time?.toFixed(0)}ms`}
                    </Typography>
                }
            </Box>
            <Paper
                elevation={2}
                style={{
                    display: "flex",
                    borderRadius: 8,
                    padding: 12,
                    width: "auto",
                    backgroundColor: "#4CC764",
                }}
            >
                <Typography variant="h5" align="left" color="#1A1A1A">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {content}
                    </ReactMarkdown>
                </Typography>
            </Paper>
        </Box>
    )
}

/**
 * 
 * @param props 
 * @returns 
 */
function AssistMsg(props: { value: ChatRoomMessage }): React.ReactNode {
    const { value } = props;
    const { content, elapsed_time, timestamp, docs, plan, is_valid } = value;
    const ttsProps: TTSOption = JSON.parse(sessionStorage.getItem("tts_model"))[0];

    // handle tts
    const [loading, setLoading] = useState<boolean>(false);
    const [speech, setSpeech] = useState<HTMLAudioElement>();
    const handleTTS = useCallback<React.MouseEventHandler<HTMLButtonElement>>(async (event) => {
        event.preventDefault();
        setLoading(true);
        if (speech) { return }
        try {
            const dataURL = await tts({ model: ttsProps.value, input: content, voice: ttsProps.voice });
            const base64String = dataURL.split(",")[1];
            const binaryString = window.atob(base64String);
            const byteNumbers = new Array(binaryString.length).fill(null).map((_, i) => binaryString.charCodeAt(i));
            const byteArray = new Uint8Array(byteNumbers);
            const audioBlob = new Blob([byteArray], { type: "audio/wav" });
            const audioURL = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioURL);
            setSpeech(audio);
            audio.play();
        } catch (error) {
            console.error(error);
            alert(error);
        } finally {
            setLoading(false)
        }
    }, [content, speech, setSpeech, setLoading])

    // handle dialog
    const [open, setOpen] = useState<boolean>(false);


    return (
        <Box
            width="100%"
            display="flex"
            justifyContent="flex-start"
        >
            <Paper
                elevation={2}
                style={{
                    display: "flex",
                    borderRadius: 8,
                    padding: 12,
                    width: "auto",
                    backgroundColor: "#383838",
                    alignItems: "center"
                }}
            >
                <Stack
                    direction="column"
                    justifyContent="flex-start"
                    alignItems="stretch"
                    spacing={0}
                >
                    {((docs || []).length > 0) &&
                        <Button
                            fullWidth
                            startIcon={<Folder fontSize="small" />}
                            onClick={() => setOpen(true)}
                            sx={{
                                fontSize: 14,
                                padding: 0,
                                margin: 0,
                            }}
                            variant="contained"
                        >
                            {`Got ${docs.length} references.`}
                        </Button>
                    }
                    <Box display="inline-flex" flexDirection="row" >
                        <Typography variant="h5" align="left" color="#FFFFFF">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {content}
                            </ReactMarkdown>
                        </Typography>
                        {loading ?
                            <CircularProgress
                                color="success"
                                size="1rem"
                                style={{ marginLeft: "1rem" }}
                            />
                            :
                            <IconButton
                                color="success"
                                size="small"
                                onClick={handleTTS}
                            >
                                <RecordVoiceOver fontSize="small" color="primary" />
                            </IconButton>
                        }
                    </Box>
                </Stack>
            </Paper>
            <Box
                display="block"
                alignContent="flex-end"
                paddingLeft={.5}
                paddingBottom={0}
            >
                {timestamp &&
                    <Typography align="left" color="#777777">
                        {timestamp}
                    </Typography>
                }
                {elapsed_time &&
                    <Typography align="left" color="#777777">
                        {`${elapsed_time?.toFixed(0)}ms`}
                    </Typography>
                }
                {is_valid &&
                    <Typography align="left" color="#777777">
                        Verified
                    </Typography>
                }
            </Box>
            <Dialog
                aria-hidden={false}
                fullWidth
                open={open}
                onClose={() => setOpen(false)}
            >
                <Stack
                    direction="column"
                    justifyContent="flex-start"
                    alignItems="stretch"
                    spacing={3}
                    padding={2}
                >
                    <TextField
                        label="Plan"
                        fullWidth
                        multiline
                        value={plan}
                        maxRows={5}
                    />
                    {(docs || []).map((doc, index) => (
                        <TextField key={index}
                            label={`Reference ${index + 1}`}
                            fullWidth
                            multiline
                            value={doc}
                            maxRows={5}
                            sx={{ padding: 2 }}
                        />
                    ))}
                </Stack>
            </Dialog>
        </Box>
    )
}