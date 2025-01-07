/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React from "react";
import { Autocomplete, Grid2, TextField, Typography } from "@mui/material";
import { getIn, useFormik } from "formik";
import * as yup from "yup";


export interface LLMParameters {
    max_completion_tokens: number,
    min_length: number,
    temperature: number,
    top_p: number,
    top_k: number,
    length_penalty: number,
    repetition_penalty: number,
    presence_penalty: number,
    frequency_penalty: number,
}

type DataValue = {
    model: string,
    parameters: LLMParameters,
}

interface ParameterFormProps {
    id?: string,
    options: {
        label: string,
        value: string,
        ref: string,
    }[],
    value: DataValue,
    onChange: (value: DataValue) => void,
}

export const schema = yup.object().shape({
    model: yup.string().required().default("gpt-4o-mini"),
    parameters: yup.object().shape({
        max_completion_tokens: yup.number().required().default(128),
        min_length: yup.number().required().default(8),
        temperature: yup.number().required().default(0.5),
        top_p: yup.number().required().default(0.5),
        top_k: yup.number().required().default(50),
        length_penalty: yup.number().required().default(1),
        repetition_penalty: yup.number().required().default(1),
        presence_penalty: yup.number().required().default(1),
        frequency_penalty: yup.number().required().default(1),
    })
})

/**
 * 
 * @returns 
 */
export const getDefaultLLMParameters = () => {
    return schema.getDefault()["parameters"]
}

/**
 * 
 * @returns 
 */
export const getDefaultLLMModel = () => {
    return schema.getDefault()["model"]
}


export default function LLMParameterForm(props: ParameterFormProps): React.ReactNode {
    const { id, options, value, onChange } = props;

    const formik = useFormik({
        initialValues: value || schema.getDefault(),
        validationSchema: schema,
        validateOnChange: true,
        onSubmit: (val) => {
            onChange({
                model: val.model,
                parameters: val.parameters,
            })
        }
    })

    return (
        <Grid2 container
            justifyContent={"center"}
            alignItems={"stretch"}
            spacing={1}
            padding={0}
        >
            <Grid2 size={12}>
                <Autocomplete
                    options={options}
                    groupBy={(e) => e.ref}
                    fullWidth
                    value={options.find(e => e.value === formik.values.model)}
                    onChange={(e, o) => {
                        formik.setFieldValue("model", o?.value)
                    }}
                    onBlur={() => formik.handleSubmit()}
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
                            error={Boolean(getIn(formik.errors, "model"))}
                            helperText={getIn(formik.errors, "model")}
                            slotProps={{
                                input: {
                                    ...params.InputProps,
                                    style: { 
                                        backgroundColor: "#FFF",
                                    }
                                }
                            }}
                        />
                    )}
                />
            </Grid2>
            <Grid2 size={6}>
                <TextField
                    required
                    type="number"
                    label="max_completion_tokens"
                    name="parameters.max_completion_tokens"
                    size="small"
                    fullWidth
                    value={formik.values.parameters.max_completion_tokens}
                    onChange={formik.handleChange}
                    onBlur={() => formik.handleSubmit()}
                    slotProps={{
                        input: {
                            inputProps: { min: 1, max: 1024, step: 1 },
                            style: { backgroundColor: "#FFF" }
                        }
                    }}
                    error={Boolean(getIn(formik.errors, "max_completion_tokens"))}
                    helperText={getIn(formik.errors, "max_completion_tokens")}
                />
            </Grid2>
            <Grid2 size={6}>
                <TextField
                    required
                    type="number"
                    label="top_k"
                    name="parameters.top_k"
                    size="small"
                    fullWidth
                    value={formik.values.parameters.top_k}
                    onChange={formik.handleChange}
                    onBlur={() => formik.handleSubmit()}
                    slotProps={{
                        input: {
                            inputProps: { min: 1, max: 100, step: 1 },
                            style: { backgroundColor: "#FFF" }
                        }
                    }}
                    error={Boolean(getIn(formik.errors, "top_k"))}
                    helperText={getIn(formik.errors, "top_k")}
                />
            </Grid2>
            <Grid2 size={6}>
                <TextField
                    required
                    type="number"
                    label="temperature"
                    name="parameters.temperature"
                    size="small"
                    fullWidth
                    value={formik.values.parameters.temperature}
                    onChange={formik.handleChange}
                    onBlur={() => formik.handleSubmit()}
                    slotProps={{
                        input: {
                            inputProps: { min: .1, max: 1, step: .1 },
                            style: { backgroundColor: "#FFF" }
                        }
                    }}
                    error={Boolean(getIn(formik.errors, "temperature"))}
                    helperText={getIn(formik.errors, "temperature")}
                />
            </Grid2>
            <Grid2 size={6}>
                <TextField
                    required
                    type="number"
                    label="top_p"
                    name="parameters.top_p"
                    size="small"
                    fullWidth
                    value={formik.values.parameters.top_p}
                    onChange={formik.handleChange}
                    onBlur={() => formik.handleSubmit()}
                    slotProps={{
                        input: {
                            inputProps: { min: .1, max: 1, step: .1 },
                            style: { backgroundColor: "#FFF" }
                        }
                    }}
                    error={Boolean(getIn(formik.errors, "top_p"))}
                    helperText={getIn(formik.errors, "top_p")}
                />
            </Grid2>
            <Grid2 size={6}>
                <TextField
                    required
                    type="number"
                    label="length_penalty"
                    name="parameters.length_penalty"
                    size="small"
                    fullWidth
                    value={formik.values.parameters.length_penalty}
                    onChange={formik.handleChange}
                    onBlur={() => formik.handleSubmit()}
                    slotProps={{
                        input: {
                            inputProps: { min: .1, max: 5, step: .1 },
                            style: { backgroundColor: "#FFF" }
                        }
                    }}
                    error={Boolean(getIn(formik.errors, "length_penalty"))}
                    helperText={getIn(formik.errors, "length_penalty")}
                />
            </Grid2>
            <Grid2 size={6}>
                <TextField
                    required
                    type="number"
                    label="repetition_penalty"
                    name="parameters.repetition_penalty"
                    size="small"
                    fullWidth
                    value={formik.values.parameters.repetition_penalty}
                    onChange={formik.handleChange}
                    onBlur={() => formik.handleSubmit()}
                    slotProps={{
                        input: {
                            inputProps: { min: .1, max: 5, step: .1 },
                            style: { backgroundColor: "#FFF" }
                        }
                    }}
                    error={Boolean(getIn(formik.errors, "repetition_penalty"))}
                    helperText={getIn(formik.errors, "repetition_penalty")}
                />
            </Grid2>
            <Grid2 size={6}>
                <TextField
                    required
                    type="number"
                    label="presence_penalty"
                    name="parameters.presence_penalty"
                    size="small"
                    fullWidth
                    value={formik.values.parameters.presence_penalty}
                    onChange={formik.handleChange}
                    onBlur={() => formik.handleSubmit()}
                    slotProps={{
                        input: {
                            inputProps: { min: .1, max: 5, step: .1 },
                            style: { backgroundColor: "#FFF" }
                        }
                    }}
                    error={Boolean(getIn(formik.errors, "presence_penalty"))}
                    helperText={getIn(formik.errors, "presence_penalty")}
                />
            </Grid2>
            <Grid2 size={6}>
                <TextField
                    required
                    type="number"
                    label="frequency_penalty"
                    name="parameters.frequency_penalty"
                    size="small"
                    fullWidth
                    value={formik.values.parameters.frequency_penalty}
                    onChange={formik.handleChange}
                    onBlur={() => formik.handleSubmit()}
                    slotProps={{
                        input: {
                            inputProps: { min: .1, max: 5, step: .1 },
                            style: { backgroundColor: "#FFF" }
                        }
                    }}
                    error={Boolean(getIn(formik.errors, "frequency_penalty"))}
                    helperText={getIn(formik.errors, "frequency_penalty")}
                />
            </Grid2>
        </Grid2>
    )
}