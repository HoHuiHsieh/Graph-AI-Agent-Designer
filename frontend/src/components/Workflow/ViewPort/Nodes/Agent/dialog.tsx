/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useState } from "react";
import { Box, Dialog, Stack, Tab, TextField } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { getIn, useFormik } from "formik";
import * as yup from "yup";
import LLMParameterForm, { schema as data_schema } from "../Common/LLMParameters";
import { AgentNodeProps } from ".";


interface SetupDialogProps {
    id: string,
    open: boolean,
    handleClose: (val: any) => void,
    node: AgentNodeProps,
}

const schema = yup.object({
    refine_llm: data_schema.shape({
        system: yup.string().required("Required"),
    }),
    chat_llm: data_schema.shape({
        system: yup.string().required("Required"),
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
    const formik = useFormik<AgentNodeProps["data"]>({
        initialValues: {
            ...schema.getDefault(),
            ...(node.data || {})
        },
        validationSchema: schema,
        validateOnChange: true,
        onSubmit: (value) => {
            handleClose({
                refine_llm: value.refine_llm,
                chat_llm: value.chat_llm,
            })
        }
    })

    return (
        <Dialog id={id}
            fullWidth
            open={open}
            onClose={() => formik.handleSubmit()}
        >
            <TabContext value={tabIndex}>
                <Box sx={{ borderBottom: 1 }}>
                    <TabList onChange={(_, val) => setTabIndex(val)} >
                        <Tab label="Node" value="1" />
                        <Tab label="Worker LLM" value="2" />
                        <Tab label="Chat LLM" value="3" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <TextField
                        fullWidth
                        multiline
                        value={JSON.stringify(node, null, "\t")}
                        maxRows={30}
                    />
                </TabPanel>
                <TabPanel value="2">
                    <Stack
                        direction="column"
                        alignItems="stretch"
                        justifyContent="center"
                        spacing={2}
                        padding={0}
                    >
                        <LLMParameterForm
                            options={JSON.parse(sessionStorage.getItem("tool_model")) || []}
                            value={formik.values.refine_llm}
                            onChange={(val) => {
                                formik.setValues((value) => ({
                                    ...value,
                                    refine_llm: {
                                        ...value.refine_llm,
                                        model: val.model,
                                        parameters: val.parameters
                                    }

                                }))
                            }}
                        />
                        <TextField
                            required
                            label="Worker Prompt"
                            name="refine_llm.system"
                            size="small"
                            fullWidth
                            multiline
                            minRows={4}
                            maxRows={10}
                            value={formik.values.refine_llm.system}
                            onChange={formik.handleChange}
                            error={Boolean(getIn(formik.errors, "refine_llm.system"))}
                            helperText={getIn(formik.errors, "refine_llm.system")}
                        />
                    </Stack>
                </TabPanel>
                <TabPanel value="3">
                    <Stack
                        direction="column"
                        alignItems="stretch"
                        justifyContent="center"
                        spacing={2}
                        padding={0}
                    >
                        <LLMParameterForm
                            options={JSON.parse(sessionStorage.getItem("chat_model")) || []}
                            value={formik.values.chat_llm}
                            onChange={(val) => {
                                formik.setValues((value) => ({
                                    ...value,
                                    chat_llm: {
                                        ...value.chat_llm,
                                        model: val.model,
                                        parameters: val.parameters
                                    }
                                }))
                            }}
                        />
                        <TextField
                            required
                            label="Chat Prompt"
                            name="chat_llm.system"
                            size="small"
                            fullWidth
                            multiline
                            minRows={4}
                            maxRows={10}
                            value={formik.values.chat_llm.system}
                            onChange={formik.handleChange}
                            error={Boolean(getIn(formik.errors, "chat_llm.system"))}
                            helperText={getIn(formik.errors, "chat_llm.system")}
                        />
                    </Stack>
                </TabPanel>
            </TabContext>
        </Dialog>
    )
}