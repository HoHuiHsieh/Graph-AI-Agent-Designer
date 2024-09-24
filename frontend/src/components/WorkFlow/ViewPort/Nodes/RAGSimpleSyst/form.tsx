/**
 * add toolbox component
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useEffect, useCallback, useRef, useState } from "react";
import { Divider, Typography, TextField, Stack, Autocomplete, Tooltip, IconButton, MenuItem, Box, Tab, Paper } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { LoadingButton, TabContext, TabList, TabPanel } from "@mui/lab";
import { Add, DeleteForeverOutlined, FileUploadOutlined } from "@mui/icons-material";
import { Node, useReactFlow } from "reactflow";
import { useFormik } from "formik";
import GetSimpleRAG from "@/api/GetSimpleRAG";
import { useWorkSpace } from "@/components/WorkFlow/provider";
import { schema, RAGSimpleSystNodeProps, seperators } from "./typedef";
import Main from ".";
import { ConvRAGData } from "../utils";


const getSimpleRAG = new GetSimpleRAG()

const SUPPORTED_FILE = [
    ".txt", ".json", ".csv", ".pdf", ".docx",
    ".pptx", ".md", ".cpp", ".js", ".ts",
    ".tsx", ".py", ".html"
]

/**
 * simple RAG component
 * @param props
 * @returns
 */
export default function RAGSimpleSystForm(
    props: Node & { data: RAGSimpleSystNodeProps["data"] }
): React.ReactNode {
    const { setNodes } = useReactFlow();
    const { options, name } = useWorkSpace();
    const [loading, setLoading] = useState<boolean>(false)
    const inputFile = useRef<HTMLInputElement | null>(null);
    const inputDocumentFile = useRef<HTMLInputElement | null>(null);
    const defaultData = schema.getDefault();

    // check RAG database been built
    const [built, setBuilt] = useState(false);
    useEffect(() => {
        getSimpleRAG.info({ id: props.id })
            .then(() => setBuilt(true))
            .catch(() => setBuilt(false))
    }, [setBuilt])

    // handle state
    const formik = useFormik<RAGSimpleSystNodeProps["data"]>({
        initialValues: {
            ...defaultData,
            ...(ConvRAGData.decode(props.data, defaultData["documents"]) as RAGSimpleSystNodeProps["data"] || {}),
            id: props.id,
        },
        validationSchema: schema,
        onSubmit: () => { },
    })

    // change node value before while re-render.
    useEffect(() => {
        return () => {
            setNodes((nodes) => {
                const index = nodes.findIndex((e) => e.id == props.id);
                if (index > -1) {
                    nodes[index].data = ConvRAGData.encode(formik.values, defaultData["documents"]);
                }
                return nodes;
            });
        }
    }, [formik, setNodes]);

    // handle tabs
    const [value, setValue] = React.useState("2");
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    // Document handlers
    // - change document content with keyboard input
    const handleChangeDocument = useCallback(
        (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
            let value = event.target.value,
                data = formik.values.documents;
            data[index].text = value;
            formik.setFieldValue("documents", data)
        }, [formik])

    const handleChangePlaceholder = useCallback(
        (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
            let value = event.target.value,
                data = formik.values.documents;
            data[index].placeholder = value;
            formik.setFieldValue("documents", data)
        }, [formik])

    // - change document content with text file
    const handleUploadDocument = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.files == null) {
                return;
            }
            event.preventDefault();
            let reader = new FileReader();
            let file = event.target.files[0];
            reader.onloadend = async () => {
                let data = formik.values.documents;
                data.push({ text: file, placeholder: "" });
                formik.setFieldValue("documents", data);
            };
            reader.readAsDataURL(file);
        },
        [formik]
    )

    // - append document rows
    const handleAppendDocument: React.MouseEventHandler<HTMLButtonElement> = useCallback(
        (event) => {
            event.preventDefault();
            let data = formik.values.documents;
            data.push({ text: "", placeholder: "" });
            formik.setFieldValue("documents", data);
        },
        [formik]
    )
    const handleDeleteDocument = useCallback(
        (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
            event.preventDefault();
            let data = formik.values.documents;
            data.splice(index, 1);
            formik.setFieldValue("documents", data);
        },
        [formik]
    )
    const parseDocument = (value: string | File) => {
        if (value instanceof File) {
            return value.name
        }
        return value
    }

    // Database handlers
    // - on-click callback for the build button
    const handleBuildDatabase = useCallback<React.MouseEventHandler<HTMLButtonElement>>(
        (event) => {
            setLoading(true);
            let props = ConvRAGData.encode(formik.values, defaultData["documents"]);
            getSimpleRAG.build({
                id: props.id,
                model: props.model,
                documents: props.documents.map(e => e.text),
                parameters: {
                    chunkOverlap: props.parameters.chunkOverlap,
                    chunkSize: props.parameters.chunkSize,
                    keepSeparator: props.parameters.keepSeparator,
                    separator: props.parameters.separator,
                }
            })
                .then(() => {
                    return getSimpleRAG.info({ id: formik.values.id })
                }).then((info) => {
                    let tmp = defaultData;
                    let props = ConvRAGData.decode({
                        ...formik.values,
                        model: info.model || tmp.model,
                        documents: info.documents.map(e => ({ text: e,  placeholder: "" })) || [],
                        parameters: {
                            chunkOverlap: info.parameters.chunkOverlap || tmp.parameters.chunkOverlap,
                            chunkSize: info.parameters.chunkSize || tmp.parameters.chunkSize,
                            keepSeparator: info.parameters.keepSeparator || tmp.parameters.keepSeparator,
                            separator: info.parameters.separator || tmp.parameters.separator,
                            num_retrieve: info.parameters.num_retrieve || tmp.parameters.num_retrieve,
                            threshold: info.parameters.threshold || tmp.parameters.threshold,
                        },
                    }, tmp["documents"]) as RAGSimpleSystNodeProps["data"];
                    formik.setValues(props);

                })
                .catch((error: any) => {
                    alert(error?.message || JSON.stringify(error))
                })
                .finally(() => {
                    setLoading(false);
                    setBuilt(true);
                })
        },
        [formik, setLoading, setBuilt]
    )

    // - on-click callback for the Upload button 
    const handleUploadDatabase = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.files == null) {
                return;
            }
            event.preventDefault();
            let reader = new FileReader();
            let file = event.target.files[0];
            if (!file) { return }
            setLoading(true);
            reader.onloadend = () => {
                getSimpleRAG.upload({
                    id: formik.values.id,
                    model: formik.values.model,
                    file,
                }).then(() => {
                    return getSimpleRAG.info({ id: formik.values.id })
                }).then((info) => {
                    let tmp = defaultData;
                    let props = ConvRAGData.decode({
                        ...formik.values,
                        model: info.model || tmp.model,
                        documents: info.documents.map(e => ({ text: e,  placeholder: "" })) || [],
                        parameters: {
                            chunkOverlap: info.parameters.chunkOverlap || tmp.parameters.chunkOverlap,
                            chunkSize: info.parameters.chunkSize || tmp.parameters.chunkSize,
                            keepSeparator: info.parameters.keepSeparator || tmp.parameters.keepSeparator,
                            separator: info.parameters.separator || tmp.parameters.separator,
                            num_retrieve: info.parameters.num_retrieve || tmp.parameters.num_retrieve,
                            threshold: info.parameters.threshold || tmp.parameters.threshold,
                        },
                    }, tmp["documents"]) as RAGSimpleSystNodeProps["data"];
                    formik.setValues(props);
                    
                }).catch((error) => {
                    console.error(error);
                    alert(error?.message || JSON.stringify(error))
                }).finally(() => {
                    setLoading(false);
                    setBuilt(true);
                })
            };
            reader.readAsArrayBuffer(file);
        },
        [formik, setLoading, setBuilt]
    )

    // - on-click callback for the download button
    const handleDownloadDatabase = useCallback<React.MouseEventHandler<HTMLButtonElement>>(
        (event) => {
            getSimpleRAG.download(formik.values.id, name)
                .catch((error) => {
                    alert(error?.message || JSON.stringify(error))
                })
        },
        [formik, name]
    )

    return (
        <div
            style={{
                display: "block",
                width: "96%",
                height: "100%",
                borderSpacing: 1,
            }}
        >
            <Typography
                variant="h3"
                textAlign="center"
                marginTop={2}
                marginBottom={1}
            >
                {Main.title}
            </Typography>
            <Divider />

            {/* Input field */}
            <TabContext value={value} >
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} variant="fullWidth" >
                        <Tab label="Parameters" value="1" />
                        <Tab label="Documents" value="2" />
                    </TabList>
                </Box>
                <TabPanel value="1" style={{ padding: 0 }} >
                    <Stack
                        direction="column"
                        justifyContent="center"
                        alignItems="stretch"
                        spacing={2}
                        padding={2}
                    >
                        <Autocomplete
                            options={options.models.embedding}
                            groupBy={(e) => e.ref}
                            fullWidth
                            value={options.models.embedding.find(e => e.value == formik.values.model)}
                            onChange={(e, o) => {
                                formik.setFieldValue("model", o?.value)
                            }}
                            getOptionLabel={(e) => e.label}
                            renderOption={(props, data) => (
                                <Typography {...props} key={`${data.ref}-${data.value}`} variant="body1">
                                    {data.label}
                                </Typography>
                            )}
                            style={{ width: "100%" }}
                            renderInput={(params) => (
                                <TextField {...params}
                                    label="LLM"
                                    name="model"
                                    size="small"
                                    style={{
                                        backgroundColor: "#FFF",
                                    }}
                                />
                            )}
                        />
                        <TextField
                            required
                            label="chunkOverlap"
                            name="parameters.chunkOverlap"
                            size="small"
                            type="number"
                            fullWidth
                            value={formik.values.parameters.chunkOverlap}
                            onChange={formik.handleChange}
                            InputProps={{
                                inputProps: { min: 0, max: 1, step: 0.1 },
                                style: { backgroundColor: "#FFF" },
                            }} />
                        <TextField
                            required
                            label="chunkSize"
                            name="parameters.chunkSize"
                            size="small"
                            type="number"
                            fullWidth
                            value={formik.values.parameters.chunkSize}
                            onChange={formik.handleChange}
                            InputProps={{
                                inputProps: { min: 1, max: 1024, step: 1 },
                                style: { backgroundColor: "#FFF" },
                            }} />
                        <TextField
                            required
                            select
                            label="separator"
                            name="parameters.separator"
                            size="small"
                            fullWidth
                            value={formik.values.parameters.separator}
                            onChange={(e) => formik.setFieldValue("parameters.separator", e.target.value)}
                            InputProps={{
                                inputProps: { min: 1, max: 10, step: 1 },
                                style: { backgroundColor: "#FFF" },
                            }}
                        >
                            {seperators.map((item) => (
                                <MenuItem key={item.label} value={item.value} >
                                    {item.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            required
                            label="num_retrieve"
                            name="parameters.num_retrieve"
                            size="small"
                            type="number"
                            fullWidth
                            value={formik.values.parameters.num_retrieve}
                            onChange={formik.handleChange}
                            InputProps={{
                                inputProps: { min: 1, max: 10, step: 1 },
                                style: { backgroundColor: "#FFF" },
                            }}
                        />
                        <TextField
                            required
                            label="threshold"
                            name="parameters.threshold"
                            size="small"
                            type="number"
                            fullWidth
                            value={formik.values.parameters.threshold}
                            onChange={formik.handleChange}
                            InputProps={{
                                inputProps: { min: -1, max: 1, step: 0.01 },
                                style: { backgroundColor: "#FFF" },
                            }}
                        />
                    </Stack>
                </TabPanel>

                {/* Document list */}
                <TabPanel value="2"
                    style={{ padding: 0, overflow: "auto" }} >
                    <Stack
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="stretch"
                        spacing={2}
                        padding={2}
                        paddingTop={4}
                        // component={Paper}
                        maxHeight="70vh"
                        style={{
                            overflow: "auto",
                            overflowY: "scroll",
                        }}
                    >
                        {formik.values.documents.map((doc, index) => (
                            <Grid key={index}
                                container
                                justifyContent="space-between"
                                alignItems="center"
                                component={Paper}
                                p={1}
                                spacing={1}
                            >
                                <Grid size={10}>
                                    <Stack
                                        direction="column"
                                        spacing={1}
                                        sx={{
                                            justifyContent: "flex-start",
                                            alignItems: "stretch",
                                        }}
                                    >
                                        <TextField
                                            label="document"
                                            size="small"
                                            multiline
                                            fullWidth
                                            maxRows={3}
                                            value={parseDocument(doc.text)}
                                            onChange={(e) => handleChangeDocument(e, index)}
                                            InputProps={{
                                                style: { backgroundColor: "#FFF" },
                                            }}
                                            disabled={doc.text instanceof File}
                                        />
                                        <TextField
                                            label="placeholder"
                                            size="small"
                                            multiline
                                            fullWidth
                                            maxRows={3}
                                            value={doc.placeholder}
                                            onChange={(e) => handleChangePlaceholder(e, index)}
                                            InputProps={{
                                                style: { backgroundColor: "#FFF" },
                                            }}
                                        />
                                    </Stack>
                                </Grid>
                                <Grid size={2}>
                                    <IconButton
                                        onClick={(e) => handleDeleteDocument(e, index)}
                                        edge="end"
                                        style={{
                                            padding: 0,
                                            margin: 0,
                                        }}
                                        size="large"
                                    >
                                        <DeleteForeverOutlined fontSize="large" />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}
                        <Stack
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            spacing={1}
                        >
                            <Tooltip title="Add Text">
                                <IconButton
                                    size="medium"
                                    onClick={(e) => handleAppendDocument(e)}
                                    style={{
                                        fontSize: "1rem"
                                    }}
                                >
                                    <Add fontSize="medium" />
                                    Add Text
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Add File">
                                <IconButton
                                    size="medium"
                                    onClick={() => inputDocumentFile.current?.click()}
                                    style={{
                                        fontSize: "1rem"
                                    }}
                                >
                                    <FileUploadOutlined fontSize="medium" />
                                    Add File
                                </IconButton>
                            </Tooltip>
                            <input
                                hidden
                                type="file"
                                accept={SUPPORTED_FILE.join(",")}
                                onChange={handleUploadDocument}
                                ref={inputDocumentFile}
                            />
                        </Stack>
                    </Stack>

                    {/* Buttom group for RAG database mgmt. */}
                    < Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={1}
                        p={1}
                    >
                        <LoadingButton
                            variant="contained"
                            color="primary"
                            loading={loading}
                            onClick={handleBuildDatabase}
                        >
                            Build DB
                        </LoadingButton>
                        <LoadingButton
                            variant="outlined"
                            color="primary"
                            loading={loading}
                            onClick={() => inputFile.current?.click()}
                        >
                            Upload DB
                        </LoadingButton>
                        <LoadingButton
                            variant="contained"
                            color="secondary"
                            loading={loading}
                            onClick={handleDownloadDatabase}
                        >
                            Download DB
                        </LoadingButton>
                        <input
                            hidden
                            type="file"
                            accept={[".tar", ".tgz"].join(",")}
                            onChange={handleUploadDatabase}
                            ref={inputFile}
                        />
                    </Stack>
                    {built ?
                        <></> :
                        <Typography
                            variant="h4"
                            color="error"
                            textAlign="center"
                        >
                            !! RAG Database not yet been built !!
                        </Typography>
                    }
                </TabPanel>
            </TabContext>
        </div >
    )
}
