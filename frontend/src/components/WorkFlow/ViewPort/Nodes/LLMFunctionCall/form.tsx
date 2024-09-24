/**
 * add toolbox component
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useCallback, useEffect } from "react";
import { Box, Divider, Typography, IconButton, Tooltip, Tab, Stack, TextField, Paper, Autocomplete, FormControlLabel, Checkbox } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Node, useReactFlow } from "reactflow";
import { FormikProps, useFormik } from "formik";
import { useWorkSpace } from "@/components/WorkFlow/provider";
import { LLMFunctionCallNodeProps, functionPropsSchema, functionsSchema, schema } from "./typedef";
import Main from ".";


/**
 * LLM function calling component
 * @param props
 * @returns
 */
export default function LLMFunctionCallForm(
    props: Node & { data: LLMFunctionCallNodeProps["data"] }
): React.ReactNode {
    const { setNodes } = useReactFlow();
    const { options } = useWorkSpace();

    // handle state
    const formik = useFormik<LLMFunctionCallNodeProps["data"]>({
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

    // handle append function
    const handlePushFunction = useCallback(() => {
        let data = formik.values.functions;
        let newData = {
            ...functionsSchema.getDefault(),
            properties: [functionPropsSchema.getDefault()]
        }
        formik.setFieldValue("functions", [...data, newData]);
    }, [formik])

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
                        <Tab label="Functions" value="2" />
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
                        {(formik.values.functions || []).map((func, f_index) => (
                            <FunctionCard key={f_index}
                                formik={formik}
                                func={func}
                                f_index={f_index}
                            />
                        ))}
                        <Tooltip title="add function">
                            <IconButton
                                size="small"
                                onClick={() => handlePushFunction()}
                            >
                                <Add fontSize="large" />
                            </IconButton>
                        </Tooltip>
                    </Stack >
                </TabPanel>
            </TabContext>
        </div>
    );
}



interface FunctionCardProps {
    formik: FormikProps<LLMFunctionCallNodeProps["data"]>,
    func: LLMFunctionCallNodeProps["data"]["functions"][0],
    f_index: number,
}


/**
 * 
 * @param props 
 * @returns 
 */
function FunctionCard(props: FunctionCardProps): React.ReactNode {
    const { formik, func, f_index } = props;

    const handleChange = useCallback((f_index: number, p_index: number, name: string, value: any) => {
        let funcData = formik.values.functions;

        // handle change function
        if (f_index < 0) { return };
        if (!funcData[f_index]) { return };
        if (p_index < 0 && name in funcData[f_index]) {
            switch (name) {
                case "name":
                    funcData[f_index].name = value;
                    break;

                case "description":
                    funcData[f_index].description = value;
                    break;

                default:
                    break;
            }
            formik.setFieldValue("functions", funcData);
            return;
        }

        // handle change function properties
        let prop_data = funcData[f_index]?.properties;
        if (p_index < 0) { return };
        if (!prop_data[p_index]) { return };
        if (name in prop_data[p_index]) {
            switch (name) {
                case "name":
                    prop_data[p_index].name = value;
                    break;

                case "description":
                    prop_data[p_index].description = value;
                    break;

                case "type":
                    prop_data[p_index].type = value;
                    break;

                case "required":
                    prop_data[p_index].required = value;
                    break;

                default:
                    break;
            }
            funcData[f_index].properties = prop_data;
            formik.setFieldValue("functions", funcData);
            return;
        }
    }, [formik])

    const handleRemoveFunction = useCallback((f_index: number) => {
        let data = formik.values.functions;
        if (data.length > 1) {
            data.splice(f_index, 1);
            formik.setFieldValue("functions", data);
        }
    }, [formik])

    const handlePushProperties = useCallback((f_index: number) => {
        let data = formik.values.functions;
        if (!data[f_index]) { return };
        let propsData = data[f_index]?.properties;
        if (!propsData) { return };
        data[f_index].properties = [...propsData, functionPropsSchema.getDefault()];;
        formik.setFieldValue("functions", data);
    }, [formik])

    return (
        <Stack
            direction="column"
            justifyContent="center"
            alignItems="stretch"
            spacing={1} m={4} p={1}
            component={Paper}
        >
            <Box width="100%" display="flex" alignItems="center" >
                <Typography variant="h5" >
                    Function {f_index + 1}
                </Typography>
                <Tooltip title="remove function" >
                    <IconButton
                        size="small"
                        onClick={() => handleRemoveFunction(f_index)}
                    >
                        <Delete />
                    </IconButton>
                </Tooltip>
            </Box>
            <TextField
                required
                label="name"
                size="small"
                fullWidth
                value={func?.name || ""}
                onChange={(e) => handleChange(f_index, -1, "name", e.target.value)}
            />
            <TextField
                required
                label="description"
                size="small"
                fullWidth
                value={func?.description || ""}
                onChange={(e) => handleChange(f_index, -1, "description", e.target.value)}
            />
            {(func?.properties || []).map((arg, p_index) => (
                <PropertyCard
                    key={p_index}
                    formik={formik}
                    arg={arg}
                    f_index={f_index}
                    p_index={p_index}
                    handleChange={handleChange}
                />
            ))}
            <Box display="flex">
                <Tooltip title="add argument">
                    <IconButton
                        size="small"
                        onClick={() => handlePushProperties(f_index)}
                        style={{ width: "100%" }}
                    >
                        <Add fontSize="large" />
                    </IconButton>
                </Tooltip>
            </Box>
        </Stack>
    )
}


interface PropertyCardProps {
    formik: FormikProps<LLMFunctionCallNodeProps["data"]>,
    f_index: number,
    p_index: number,
    arg: LLMFunctionCallNodeProps["data"]["functions"][0]["properties"][0],
    handleChange: (f_index: number, p_index: number, name: string, value: any) => void,
}

/**
 * 
 * @param props 
 * @returns 
 */
function PropertyCard(props: PropertyCardProps): React.ReactNode {
    const { formik, arg, f_index, p_index, handleChange } = props;

    const handleRemoveProperties = useCallback((f_index: number, p_index: number) => {
        let data = formik.values.functions;
        if (!data[f_index]) { return };
        let p_data = data[f_index].properties;
        p_data.splice(p_index, 1);
        data[f_index].properties = p_data;
        formik.setFieldValue("functions", data);
    }, [formik])

    return (
        <Stack
            direction="column"
            justifyContent="center"
            alignItems="stretch"
            spacing={1} m={4} p={1}
            component={Paper}
        >
            <Box width="100%" display="flex" alignItems="center" >
                <Typography variant="h5" >
                    Argument {p_index + 1}
                </Typography>
                <Tooltip title="remove argument" >
                    <IconButton
                        size="small"
                        onClick={() => handleRemoveProperties(f_index, p_index)}
                    >
                        <Delete />
                    </IconButton>
                </Tooltip>
            </Box>
            <TextField
                required
                fullWidth
                size="small"
                label="name"
                value={arg.name}
                onChange={(e) => handleChange(f_index, p_index, "name", e.target.value)}
            />
            <TextField
                required
                fullWidth
                size="small"
                label="type"
                value={arg.type}
                onChange={(e) => handleChange(f_index, p_index, "type", e.target.value)}
            />
            <TextField
                required
                fullWidth
                size="small"
                label="description"
                multiline
                maxRows={5}
                value={arg.description}
                onChange={(e) => handleChange(f_index, p_index, "description", e.target.value)}
            />
            <FormControlLabel
                label="Required: "
                labelPlacement="start"
                control={<Checkbox />}
                checked={arg.required}
                onChange={(e, val) => {
                    console.log(val);
                    
                    handleChange(f_index, p_index, "required", val)
                }}
            />
        </Stack>
    )
}