/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useState } from "react";
import { Box, Dialog, Tab, TextField } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { getIn, useFormik } from "formik";
import * as yup from "yup";
import LLMParameterForm, { schema as data_schema } from "../../Common/LLMParameters";
import { LLMPlanNodeProps } from ".";


interface SetupDialogProps {
    id: string,
    open: boolean,
    handleClose: (val: any) => void,
    node: LLMPlanNodeProps,
}

const schema = data_schema.shape({
    iden_prompt: yup.string().required("Required").test("contain-words",
        "'{{ message }}' is required in prompt.", (value) => {
            const requiredWords = ["{{ message }}"];
            return requiredWords.every(word => value && value.includes(word))
        }),
    plan_prompt: yup.string().required("Required").test("contain-words",
        "'{{ methods }}' is required in prompt.", (value) => {
            const requiredWords = ["{{ methods }}"];
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
    const formik = useFormik<LLMPlanNodeProps["data"]>({
        initialValues: {
            ...schema.getDefault(),
            ...(node.data || {})
        },
        validationSchema: schema,
        validateOnChange: true,
        onSubmit: (value) => {
            handleClose({
                model: value.model,
                parameters: value.parameters,
                iden_prompt: value.iden_prompt,
                plan_prompt: value.plan_prompt
            })
        }
    })

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
                        <Tab label="Planner LLM" value="2" />
                        <Tab label="Reasoning" value="3" />
                        <Tab label="Generate Task" value="4" />
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
                    <LLMParameterForm
                        options={JSON.parse(sessionStorage.getItem("chat_model")) || []}
                        value={formik.values}
                        onChange={(val) => {
                            formik.setFieldValue("model", val.model);
                            formik.setFieldValue("parameters", val.parameters);
                        }}
                    />
                </TabPanel>
                <TabPanel value="3">
                    <TextField
                        required
                        label="Reasoning Prompt"
                        name="iden_prompt"
                        size="small"
                        fullWidth
                        multiline
                        minRows={5}
                        maxRows={30}
                        value={formik.values.iden_prompt}
                        onChange={formik.handleChange}
                        error={Boolean(getIn(formik.errors, "iden_prompt"))}
                        helperText={getIn(formik.errors, "iden_prompt")}
                    />
                </TabPanel>
                <TabPanel value="4">
                    <TextField
                        required
                        label="Tasks Generating Prompt"
                        name="plan_prompt"
                        size="small"
                        fullWidth
                        multiline
                        minRows={5}
                        maxRows={30}
                        value={formik.values.plan_prompt}
                        onChange={formik.handleChange}
                        error={Boolean(getIn(formik.errors, "plan_prompt"))}
                        helperText={getIn(formik.errors, "plan_prompt")}
                    />
                </TabPanel>
            </TabContext>
        </Dialog>
    )
}