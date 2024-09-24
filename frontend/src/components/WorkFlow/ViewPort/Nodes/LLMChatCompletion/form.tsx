/**
 * add toolbox component
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useEffect } from "react";
import { Divider, Typography, TextField, Autocomplete, Stack } from "@mui/material";
import { Node, useReactFlow } from "reactflow";
import { useWorkSpace } from "@/components/WorkFlow/provider";
import { useFormik } from "formik";
import { LLMChatCompletionNodeProps, schema } from "./typedef";
import Main from ".";


/**
 * LLM chat completion component
 * @param props
 * @returns
 */
export default function LLMChatCompletionForm(props: Node & { label?: string, data: LLMChatCompletionNodeProps["data"] }): React.ReactNode {
    const { setNodes } = useReactFlow();
    const { options } = useWorkSpace();

    // handle state
    const formik = useFormik<LLMChatCompletionNodeProps["data"]>({
        initialValues: {
            ...schema.getDefault(),
            ...(props.data || {})
        },
        validationSchema: schema,
        validateOnChange: true,
        onSubmit: () => { },
    });

    useEffect(() => {
        return () =>
            setNodes((nodes) => {
                // change node value
                const index = nodes.findIndex((e) => e.id == props.id);
                if (index > -1) {
                    nodes[index].data = formik.values;
                }
                return nodes;
            });
    }, [formik.values, setNodes]);

    return (
        <React.Fragment>
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
                <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="stretch"
                    spacing={2}
                    padding={2}
                >
                    <Autocomplete
                        options={options.models.chat}
                        groupBy={(e) => e.ref}
                        fullWidth
                        value={options.models.chat.find(e => e.value == formik.values.model)}
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
                        type="number"
                        label="max_token"
                        name="parameters.max_token"
                        size="small"
                        fullWidth
                        value={formik.values.parameters?.max_token}
                        onChange={formik.handleChange}
                        InputProps={{
                            inputProps: { min: 1, max: 1024, step: 1 },
                            style: { backgroundColor: "#FFF" },
                        }}
                    />
                    <TextField
                        required
                        type="number"
                        label="temperature"
                        name="parameters.temperature"
                        size="small"
                        fullWidth
                        value={formik.values.parameters?.temperature}
                        onChange={formik.handleChange}
                        InputProps={{
                            inputProps: { min: 0.01, max: 1, step: 0.01 },
                            style: { backgroundColor: "#FFF" },
                        }}
                    />
                    <TextField
                        required
                        type="number"
                        label="top_p"
                        name="parameters.top_p"
                        size="small"
                        fullWidth
                        value={formik.values.parameters?.top_p}
                        onChange={formik.handleChange}
                        InputProps={{
                            inputProps: { min: 0.01, max: 1, step: 0.01 },
                            style: { backgroundColor: "#FFF" },
                        }}
                    />
                    <TextField
                        required
                        type="number"
                        label="top_k"
                        name="parameters.top_k"
                        size="small"
                        fullWidth
                        value={formik.values.parameters?.top_k}
                        onChange={formik.handleChange}
                        InputProps={{
                            inputProps: { min: 1, max: 100, step: 1 },
                            style: { backgroundColor: "#FFF" },
                        }}
                    />
                    <TextField
                        required
                        type="number"
                        label="penalty"
                        name="parameters.penalty"
                        size="small"
                        fullWidth
                        value={formik.values.parameters?.penalty}
                        onChange={formik.handleChange}
                        InputProps={{
                            inputProps: { min: 0.01, max: 3, step: 0.1 },
                            style: { backgroundColor: "#FFF" },
                        }}
                    />
                </Stack>
            </div>
        </React.Fragment>
    );
}
