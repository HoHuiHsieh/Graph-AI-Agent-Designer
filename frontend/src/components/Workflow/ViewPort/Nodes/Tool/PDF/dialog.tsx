/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useCallback, useRef, useState } from "react";
import { Box, Dialog, IconButton, InputAdornment, Stack, Tab, TextField, Tooltip, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { getIn, useFormik } from "formik";
import ReactCodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import * as yup from "yup";
import LLMToolForm, { schema as data_schema } from "../../Common/LLMToolUse";
import { PDFToolNodeProps } from ".";
import { UploadFile } from "@mui/icons-material";
import { uploadFile as uploadRAGDocument } from "@/api/GetRAGDocs";


const fileSizeLimit = 5 * 1024 * 1024; // 5MB file size limit

interface SetupDialogProps {
    id: string,
    open: boolean,
    handleClose: (val: any) => void,
    node: PDFToolNodeProps,
}

const schema = data_schema.shape({
    filename: yup.string().default(""),
    checksum: yup.string().default(""),
    prompt: yup.string().required("Required").default("").test("contain-words",
        "'{{ content }}' is required in prompt.", (value) => {
            const requiredWords = ["{{ content }}"];
            return requiredWords.every(word => value && value.includes(word))
        }),
})

/**
 * 
 * @param props 
 * @returns 
 */
export default function SetupDialog(props: SetupDialogProps): React.ReactNode {
    const { id, open, handleClose, node } = props;

    // handle switch tabs
    const [tabIndex, setTabIndex] = useState<string>("2");

    // handle data form
    const formik = useFormik<PDFToolNodeProps["data"]>({
        initialValues: {
            ...schema.getDefault(),
            ...(node.data || {})
        },
        validationSchema: schema,
        validateOnChange: true,
        onSubmit: (value) => {
            handleClose({
                name: value.name,
                description: value.description,
                properties: value.properties,
                filename: value.filename,
                checksum: value.checksum,
                prompt: value.prompt,
            })
        }
    })

    // handle upload file
    const inputFile = useRef<HTMLInputElement | null>(null);
    const uploadFile = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
        const reader = new FileReader();
        if (!event.target.files) { return }
        const file = event.target.files[0];
        if (!file) { return }
        reader.onloadend = async () => {
            try {
                if (file.size > fileSizeLimit) {
                    throw new Error("File size should less than 5MB.")
                }
                // upload file
                const checksum = await uploadRAGDocument(file);
                formik.setValues((value) => ({
                    ...value,
                    filename: file.name,
                    checksum: checksum,
                }))
                console.log(`${file.name}:${checksum}`);

            } catch (error) {
                console.error(error);
                alert(error?.response?.data || error);
            }
        }
        reader.readAsDataURL(file);
    }, [formik])

    return (
        <Dialog id={`Dialog-${id}`}
            fullWidth
            open={open}
            onClose={() => formik.handleSubmit()}
        >
            <TabContext value={tabIndex} >
                <Box sx={{ borderBottom: 1 }}>
                    <TabList onChange={(_, val) => setTabIndex(val)} >
                        <Tab label="Node" value="1" />
                        <Tab label="Tool info" value="2" />
                        <Tab label="PDF File" value="3" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <TextField id={`Base-${id}`}
                        fullWidth
                        multiline
                        value={JSON.stringify(node, null, "\t")}
                        maxRows={30}
                    />
                </TabPanel>
                <TabPanel value="2">
                    <LLMToolForm id={`PDFTool-${id}`}
                        fixedProperty={true}
                        value={formik.values}
                        onChange={(val) => {
                            formik.setValues((value) => ({
                                ...value,
                                name: val.name,
                                description: val.description,
                                properties: val.properties,
                            }))
                        }}
                    />
                </TabPanel>
                <TabPanel value="3">
                    <Stack
                        direction="column"
                        justifyContent="center"
                        alignItems="stretch"
                        spacing={2}
                        padding={0}
                    >
                        <TextField
                            required
                            label="Upload PDF"
                            name="filename"
                            size="small"
                            fullWidth
                            value={formik.values.filename}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Tooltip placement="right"
                                                title={(
                                                    <Typography variant="body1">Upload</Typography>
                                                )}
                                            >
                                                <IconButton onClick={() => inputFile.current?.click()}>
                                                    <UploadFile fontSize="large" />
                                                </IconButton>
                                            </Tooltip>
                                        </InputAdornment>
                                    ),
                                    style: { backgroundColor: "#FFF" }
                                }
                            }}
                            error={Boolean(getIn(formik.errors, "filename"))}
                            helperText={getIn(formik.errors, "filename")}
                        />
                        <TextField
                            required
                            label="Templete"
                            name="prompt"
                            size="small"
                            fullWidth
                            multiline
                            minRows={5}
                            maxRows={30}
                            value={formik.values.prompt}
                            onChange={formik.handleChange}
                            error={Boolean(getIn(formik.errors, "prompt"))}
                            helperText={getIn(formik.errors, "prompt")}
                        />
                        <input id={`uploadPDFfile-${id}`}
                            hidden
                            type="file"
                            accept={".pdf"}
                            onChange={uploadFile}
                            ref={inputFile}
                        />
                    </Stack>
                </TabPanel>
            </TabContext>
        </Dialog>
    )
}