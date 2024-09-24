/**
 * add chatroom dialog components
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useCallback, useState } from "react";
import { Box, CircularProgress, IconButton, Paper, Typography } from "@mui/material";
import { RecordVoiceOver } from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import GetSpeech from "@/api/GetSpeech";
import { DialogBox, ImageBox } from "./typedef";


/**
 * dialog for user prompt 
 * @param props 
 * @returns 
 */
export function UserDialog(props: DialogBox): React.ReactNode {
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
                paddingRight={0.5}
                paddingBottom={0}
            >
                {timestamp &&
                    <Typography align="left" color="#777777" >
                        {timestamp}
                    </Typography>
                }
                {elapsed_time &&
                    <Typography align="left" color="#777777" >
                        {`${elapsed_time?.toFixed(0)}ms` || ""}
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
                    backgroundColor: "#4CC764"
                }}
            >
                <Typography variant="h5" align="left" color="#1A1A1A" >
                    {content}
                </Typography>
            </Paper>

        </Box>
    )
}


/**
 * dialog for bot response
 * @param props 
 * @returns 
 */
export function BotDialog(props: DialogBox): React.ReactNode {
    const { value } = props;
    const { content, elapsed_time, timestamp } = value;

    // handle tts
    const [speech, setSpeech] = useState<HTMLAudioElement>();
    const [loading, setLoading] = useState<boolean>(false);
    const handleSubmit = useCallback(async () => {
        setLoading(true);
        try {
            if (!speech) {
                const getSpeech = new GetSpeech();
                const url = await getSpeech.tts(content);

                let base64 = url.split(";base64,")[1]
                let raw = window.atob(base64);
                let rawLength = raw.length;
                let arr = new Uint8Array(new ArrayBuffer(rawLength));
                for (let i = 0; i < rawLength; i++) {
                    arr[i] = raw.charCodeAt(i);
                }
                let audioBlob = new Blob([arr], { type: "audio/wav" }),
                    newURL = URL.createObjectURL(audioBlob);
                let sound = new Audio(newURL);
                setSpeech(sound)
                sound.play();
            } else {
                speech.play()
            }
        } catch (error) {
            console.error(error);
            alert(error);
        } finally {
            setLoading(false)
        }
    }, [speech, setSpeech])

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
                <Typography variant="h5" align="left" color="#FFFFFF" >
                    <ReactMarkdown remarkPlugins={[remarkGfm]} >
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
                        onClick={handleSubmit}
                    >
                        <RecordVoiceOver fontSize="small" color="primary" />
                    </IconButton>
                }
            </Paper>
            <Box
                display="block"
                alignContent="flex-end"
                paddingLeft={0.5}
            >
                {timestamp &&
                    <Typography align="left" color="#777777" >
                        {timestamp}
                    </Typography>
                }
                {elapsed_time &&
                    <Typography align="left" color="#777777" >
                        {`${(elapsed_time / 1000).toFixed(2)}sec` || ""}
                    </Typography>
                }
            </Box>
        </Box>
    )

}


/**
 * dialog for image
 * @param props 
 * @returns 
 */
export function ImageDialog(props: ImageBox): React.ReactNode {
    const { value } = props;
    const content: { name: string, arguments: { src: string } } = JSON.parse(value.content);
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
                    backgroundColor: "#383838"
                }}
            >
                <Box
                    component="img"
                    sx={{
                        height: "auto",
                        width: "100%",
                    }}
                    src={content.arguments?.src || undefined}
                />
            </Paper>
        </Box>
    )
}


/**
 * dialog for video
 * @param props 
 * @returns 
 */
export function VideoDialog(props: ImageBox): React.ReactNode {
    const { value } = props;
    const content: { name: string, arguments: { src: string } } = JSON.parse(value.content);
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
                    backgroundColor: "#383838"
                }}
            >
                <Box
                    component="video"
                    sx={{
                        height: "auto",
                        width: "100%",
                    }}
                    src={content.arguments?.src || undefined}
                    controls
                />
            </Paper>
        </Box>
    )
}