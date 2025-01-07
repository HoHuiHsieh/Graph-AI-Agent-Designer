/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useCallback, useRef } from "react";
import { IconButton, Stack, TextField } from "@mui/material";
import { FormikProps } from "formik";
import { ChatRoomNodeProps } from "..";
import { Send } from "@mui/icons-material";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { asr, Option } from "@/api/GetModel";
import { v4 } from "uuid";


interface InputFieldProps {
    loading: boolean,
    formik: FormikProps<ChatRoomNodeProps["data"]>
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    onSubmit: React.MouseEventHandler<HTMLButtonElement>,
}

/**
 * 
 * @param props 
 * @returns 
 */
export default function InputField(props: InputFieldProps): React.ReactNode {
    const { loading, formik, setLoading, onSubmit } = props;
    const asrProps: Option = JSON.parse(sessionStorage.getItem("asr_model"))[0];


    // handle hotkey
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const keyPress: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
        if (["Enter", "NumpadEnter"].includes(event.code) && event.ctrlKey) {
            buttonRef.current?.click();
        }
    }

    // handle asr
    const recorderControls = useAudioRecorder();
    const addAudioElement = useCallback(async (blob: Blob) => {
        setLoading(true);
        try {
            const file = new File([blob], `${v4()}.opus`, { type: blob.type });
            const text = asr(asrProps.value, file);
            formik.setFieldValue("prompt", text);
        } catch (error) {
            console.error(error);
            alert(error?.response?.data || JSON.stringify(error));
        } finally {
            setLoading(false);
        }
    }, [formik, setLoading])


    if (!formik) { return <></> }
    return (
        <TextField
            fullWidth
            multiline
            variant="outlined"
            name="prompt"
            value={formik.values.prompt}
            onChange={formik.handleChange}
            onKeyDown={keyPress}
            maxRows={6}
            slotProps={{
                input: {
                    style: {
                        color: "#FFFFFF",
                        backgroundColor: "#383838",
                        height: "15vh",
                        overflow: "hidden"
                    },
                    endAdornment: (
                        <Stack
                            direction="row"
                            justifyContent="flex-end"
                            alignItems="center"
                            spacing={0}
                            height="100%"
                        >
                            <IconButton size="small"
                                ref={buttonRef}
                                color="primary"
                                onClick={onSubmit}
                                disabled={loading}
                            >
                                <Send fontSize="large" style={{ color: "#949494" }} />
                            </IconButton>
                            <AudioRecorder
                                onRecordingComplete={addAudioElement}
                                recorderControls={recorderControls}
                                mediaRecorderOptions={{
                                    audioBitsPerSecond: 16000,
                                }}
                            />
                        </Stack>
                    )
                },
            }}
        />
    )
}