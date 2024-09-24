/**
 * add toolbox component
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useEffect } from "react";
import { Box, Divider, Typography, Tab, Stack, TextField, Autocomplete } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Node, useReactFlow } from "reactflow";
import { useFormik } from "formik";
import { useWorkSpace } from "@/components/WorkFlow/provider";
import { LLMCheckFactNodeProps, schema } from "./typedef";
import Main from ".";


/**
 * LLM fact checking component
 * @param props
 * @returns
 */
export default function LLMCheckFactForm(
    props: Node & { data: LLMCheckFactNodeProps["data"] }
): React.ReactNode {
    const { setNodes } = useReactFlow();
    const { options } = useWorkSpace();

    // handle state
    const formik = useFormik<LLMCheckFactNodeProps["data"]>({
        initialValues: {
            ...schema.getDefault(),
            ...(props.data || {})
        },
        validationSchema: schema,
        validateOnChange: true,
        onSubmit: () => { },
    });

    // change node value before while re-render.
    useEffect(() => {
        return () =>
            setNodes((nodes) => {
                const index = nodes.findIndex((e) => e.id == props.id);
                if (index > -1) {
                    nodes[index].data = formik.values;
                }
                return nodes;
            });
    }, [formik, setNodes]);

    // handle tabs
    const [value, setValue] = React.useState("2");
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

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
            <TabContext value={value} >
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} variant="fullWidth" >
                        <Tab label="Parameters" value="1" />
                        <Tab label="Prompt" value="2" />
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
                </TabPanel>
                <TabPanel value="2"
                    style={{ padding: 0, height: "75vh", overflow: "auto" }} >
                    <Stack
                        direction="column"
                        justifyContent="center"
                        alignItems="stretch"
                        spacing={1}
                        style={{ margin: 10 }}
                    >
                        <TextField
                            label="prompt"
                            name="prompt"
                            size="medium"
                            fullWidth
                            multiline
                            minRows={10}
                            maxRows={30}
                            value={formik.values.prompt}
                            onChange={formik.handleChange}
                            InputProps={{
                                style: { backgroundColor: "#FFF" },
                            }}
                        />
                        <Typography variant="h5" align="left" color="primary" >
                            {`* Both {{ evdience }} and {{ prompt }} labels are required.`}
                        </Typography>
                    </Stack >
                </TabPanel>
            </TabContext>
        </div>
    );
}
