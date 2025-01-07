/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useState } from "react";
import { Box, Dialog, Tab, TextField } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { getIn, useFormik } from "formik";
import * as yup from "yup";
import { PromptPlanNodeProps } from ".";


interface SetupDialogProps {
    id: string,
    open: boolean,
    handleClose: (val: any) => void,
    node: PromptPlanNodeProps,
}

const schema = yup.object({
    prompt: yup.string().required("Required"),
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
    const formik = useFormik<PromptPlanNodeProps["data"]>({
        initialValues: {
            ...schema.getDefault(),
            ...(node.data || {})
        },
        validationSchema: schema,
        validateOnChange: true,
        onSubmit: (value) => {
            handleClose({ prompt: value.prompt })
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
                        <Tab label="Plan" value="2" />
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
                    <TextField
                        required
                        label="Plan List"
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