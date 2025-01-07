/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useCallback, useState } from "react";
import { FormikProps } from "formik";
import moment from "moment";
import { useReactFlow } from "reactflow";
import { ChatRoomMessage } from "@/components/Workflow/typedef";
import { ChatRoomNodeProps } from "..";
import { runWorkflow } from "@/api/GetWorkflow";
import { Stack } from "@mui/material";
import ChatMsgs from "./ChatMsgs";
import InputField from "./InputField";
import Actions from "./Actions";


interface ChatRoomFormProps {
    id: string,
    formik: FormikProps<ChatRoomNodeProps["data"]>,
    onClose: () => void,
}

/**
 * 
 * @param props 
 * @returns 
 */
export default function ChatRoomForm(props: ChatRoomFormProps): React.ReactNode {
    const { id, formik, onClose } = props;
    const { getNodes, getEdges, setNodes } = useReactFlow();
    const [loading, setLoading] = useState<boolean>(false);

    // handle update
    const handleUpdate = (messages: ChatRoomMessage[]) => formik.setFieldValue("messages", messages);

    // handle clear
    const handleClear = () => formik.setFieldValue("messages", []);

    // handle undo
    const handleUndo = () => {
        let messages = formik.values.messages;
        let msg = messages.pop();
        while (msg?.role == "assistant") {
            msg = messages.pop();
            if (messages.length == 0) {
                break;
            }
        };
        handleUpdate(messages);
    }

    // handle submit
    const handleSubmit = useCallback<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        event.preventDefault();

        // check has text
        if (!formik.values.prompt.trim()) { return }

        // check messages
        let messages = formik.values.messages;
        if (messages[messages.length - 1]?.role === "user") { messages.pop(); }

        // insert prompt
        messages = [
            ...messages,
            {
                role: "user",
                content: formik.values.prompt,
                timestamp: moment().format("HH:mm")
            }
        ]
        handleUpdate(messages);

        // run workflow
        setLoading(true);
        let nodes = getNodes(),
            edges = getEdges();
        nodes = nodes.map((e) => {
            if (e.id === props.id) { e.data.messages = messages }
            return e
        })
        runWorkflow(nodes, edges)
            .then((response) => {
                console.log(response);
                response.nodes.forEach((node) => {
                    if (node.id === props.id) {
                        handleUpdate(node.data.messages);
                    }
                })
                formik.setFieldValue("prompt", "");
            })
            .catch((error) => {
                console.error(error);
                alert(error?.response?.data || error?.message || JSON.stringify(error));
            })
            .finally(() => setLoading(false))

    }, [props.id, formik, setLoading, getNodes, getEdges]);

    if (!formik) { return <></> }
    return (
        <Stack id={`ChatRoomFormField-${id}`}
            direction="column"
            justifyContent="flex-start"
            alignItems="stretch"
            bgcolor="#111111"
            spacing={1}
            padding={0}
        >
            <React.Fragment>
                <ChatMsgs value={formik.values.messages} />
                <InputField
                    formik={formik}
                    loading={loading}
                    setLoading={setLoading}
                    onSubmit={handleSubmit}
                />
                <Actions
                    onClear={handleClear}
                    onUndo={handleUndo}
                    onClose={() => onClose()}
                />
            </React.Fragment>
        </Stack>
    )
}