/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useState } from "react";
import { Box, Dialog, Tab, TextField } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { getIn, useFormik } from "formik";
import ReactCodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import * as yup from "yup";
import LLMToolForm, { schema as data_schema } from "../../Common/LLMToolUse";
import { PythonToolNodeProps } from ".";


interface SetupDialogProps {
    id: string,
    open: boolean,
    handleClose: (val: any) => void,
    node: PythonToolNodeProps,
}

const schema = data_schema.shape({
    code: yup.string().required("Required").default(""),
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
    const formik = useFormik<PythonToolNodeProps["data"]>({
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
                code: value.code
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
                        <Tab label="Python Code" value="3" />
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
                    <LLMToolForm id={`PythonTool-${id}`}
                        value={formik.values}
                        onChange={(val) => {
                            formik.setValues((value)=>({
                                ...value,
                                name: val.name,
                                description: val.description,
                                properties: val.properties,
                            }))
                        }}
                    />
                </TabPanel>
                <TabPanel value="3">
                    <ReactCodeMirror id={`Python-${id}`}
                        aria-hidden={false}
                        maxHeight="64vh"
                        theme={vscodeDark}
                        value={formik.values.code}
                        extensions={[python()]}
                        onChange={(code) => formik.setFieldValue("code", code)}
                    />
                </TabPanel>
            </TabContext>
        </Dialog>
    )
}