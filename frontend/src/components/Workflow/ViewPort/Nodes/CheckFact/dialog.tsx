/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useState } from "react";
import { Box, Dialog, Stack, Tab, TextField } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { getIn, useFormik } from "formik";
import * as yup from "yup";
import LLMParameterForm, { schema as llm_params_schema } from "../Common/LLMParameters";
import LLMToolForm, { schema as llm_tool_schema } from "../Common/LLMToolUse";
import { CheckFactNodeProps } from ".";


interface SetupDialogProps {
    id: string,
    open: boolean,
    handleClose: (val: any) => void,
    node: CheckFactNodeProps,
}

const schema = yup.object({
    llm: llm_params_schema,
    tool: llm_tool_schema,
    prompt: yup.string().required("Required").test("contain-words",
        "'{{ evidence }}' and '{{ message }}' are required in prompt.", (value) => {
            const requiredWords = ["{{ methods }}", "{{ evidence }}"];
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
    const formik = useFormik<CheckFactNodeProps["data"]>({
        initialValues: {
            ...schema.getDefault(),
            ...(node.data || {})
        },
        validationSchema: schema,
        validateOnChange: true,
        onSubmit: (value) => {
            handleClose({
                llm: value.llm,
                tool: value.tool,
                prompt: value.prompt,
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
                        <Tab label="CheckFact LLM" value="2" />
                        <Tab label="Tool Info" value="3" />
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
                    <LLMParameterForm
                        options={JSON.parse(sessionStorage.getItem("tool_model")) || []}
                        value={formik.values.llm}
                        onChange={(val) => {
                            formik.setValues((value) => ({
                                ...value,
                                model: val.model,
                                parameters: val.parameters
                            }))
                        }}
                    />
                </TabPanel>
                <TabPanel value="3">
                    <Stack
                        direction="column"
                        alignItems="stretch"
                        justifyContent="center"
                        spacing={2}
                        padding={0}
                    >
                        <LLMToolForm id={`CheckFactTool-${id}`}
                            fixedProperty={true}
                            value={formik.values.tool}
                            onChange={(val) => {
                                formik.setValues((value) => ({
                                    ...value,
                                    name: val.name,
                                    description: val.description,
                                    properties: val.properties,
                                }))
                            }}
                        />
                        <TextField
                            required
                            label="CheckFact Prompt"
                            name="prompt"
                            size="small"
                            fullWidth
                            multiline
                            minRows={4}
                            maxRows={10}
                            value={formik.values.prompt}
                            onChange={formik.handleChange}
                            error={Boolean(getIn(formik.errors, "prompt"))}
                            helperText={getIn(formik.errors, "prompt")}
                        />
                    </Stack>
                </TabPanel>
            </TabContext>
        </Dialog>
    )
}