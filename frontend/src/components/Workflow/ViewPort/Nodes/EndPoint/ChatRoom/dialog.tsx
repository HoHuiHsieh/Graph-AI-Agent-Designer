/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useState } from "react";
import { Box, Dialog, Tab, TextField } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { getIn, useFormik } from "formik";
import * as yup from "yup";
import { ChatRoomNodeProps } from ".";
import ChatRoomForm from "./form";


interface SetupDialogProps {
    id: string,
    open: boolean,
    handleClose: (val: any) => void,
    node: ChatRoomNodeProps,
}

const schema = yup.object({
    prompt: yup.string(),
    messages: yup.array().of(
        yup.object({
            role: yup.string(),
            content: yup.string(),
        })
    ).default([]),
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
    const formik = useFormik<ChatRoomNodeProps["data"]>({
        initialValues: {
            ...schema.getDefault(),
            ...(node.data || {})
        },
        validationSchema: schema,
        validateOnChange: true,
        onSubmit: (value) => {
            handleClose({ messages: value.messages })
        }
    })

    return (
        <Dialog id={`Dialog-${id}`}
            fullWidth
            fullScreen={tabIndex == "2" ? true : false}
            open={open}
            onClose={() => formik.handleSubmit()}
        >
            <TabContext value={tabIndex} >
                <Box sx={{ borderBottom: 1 }}>
                    <TabList onChange={(_, val) => setTabIndex(val)} >
                        <Tab label="Node" value="1" />
                        <Tab label="ChatRoom" value="2" />
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
                    <ChatRoomForm id={id}
                        formik={formik}
                        onClose={() => formik.handleSubmit()}
                    />
                </TabPanel>
            </TabContext>
        </Dialog>
    )
}