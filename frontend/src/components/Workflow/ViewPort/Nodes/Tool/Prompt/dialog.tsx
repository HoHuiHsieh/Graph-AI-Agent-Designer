/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useState } from "react";
import { Box, Dialog, Tab, TextField } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { getIn, useFormik } from "formik";
import * as yup from "yup";
import LLMToolForm, { schema as data_schema } from "../../Common/LLMToolUse";
import { PromptToolNodeProps } from ".";


interface SetupDialogProps {
    id: string,
    open: boolean,
    handleClose: (val: any) => void,
    node: PromptToolNodeProps,
}

const schema = data_schema.shape({
    prompt: yup.string().required("Required").default(""),
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
    const formik = useFormik<PromptToolNodeProps["data"]>({
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
                prompt: value.prompt,
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
                        <Tab label="Tool info" value="2" />
                        <Tab label="Prompt" value="3" />
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
                    <LLMToolForm id={`PromptTool-${id}`}
                        noProperty={true}
                        value={formik.values}
                        onChange={(val) => {
                            formik.setValues((value) => ({
                                ...value,
                                name: val.name,
                                description: val.description,
                            }))
                        }}
                    />
                </TabPanel>
                <TabPanel value="3">
                    <TextField
                        required
                        label="Prompt"
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
                </TabPanel>
            </TabContext>
        </Dialog>
    )
}