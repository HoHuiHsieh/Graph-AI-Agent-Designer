/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useCallback } from "react";
import { Autocomplete, Checkbox, FormControlLabel, Grid2, IconButton, Paper, Stack, TextField, Tooltip, Typography, useTheme } from "@mui/material";
import { useFormik, FormikProps, getIn } from "formik";
import * as yup from "yup";
import { Delete } from "@mui/icons-material";


export interface LLMCallFunction {
    name: string,
    description: string,
    properties?: {
        name: string,
        type: string,
        description: string,
        required: boolean,
    }[]
}

interface LLMToolFormProps {
    id?: string,
    value: LLMCallFunction,
    onChange: (value: LLMCallFunction) => void,
    noProperty?: boolean,
    fixedProperty?: boolean,
}

export const schema = yup.object().shape({
    name: yup.string().required("請輸入文字。").default(""),
    description: yup.string().required("請輸入文字。").default(""),
    properties: yup.array().of(yup.object().shape({
        name: yup.string().required("請輸入文字。").default(""),
        type: yup.string().required("請輸入文字。").default(""),
        description: yup.string().required("請輸入文字。").default(""),
        required: yup.boolean().required().default(false),
    })).default([])
})

export const getDefaultToolProperty = () => {
    return schema.getDefault()["properties"]
}

/**
 * 
 * @param props 
 * @returns 
 */
export default function LLMToolForm(props: LLMToolFormProps): React.ReactNode {
    const { id, value, onChange, noProperty, fixedProperty } = props;

    // handle form
    const formik = useFormik({
        initialValues: value || schema.getDefault(),
        validationSchema: schema,
        validateOnChange: true,
        onSubmit: (val) => {
            onChange({
                name: val.name,
                description: val.description,
                properties: val.properties,
            })
        }
    })

    // handle append property
    const handleAppendProperty = useCallback<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        event.preventDefault();
        formik.setFieldValue("properties", [
            ...formik.values.properties,
            getDefaultToolProperty(),
        ])
    }, [formik])

    return (
        <Stack id={id}
            direction="column"
            justifyContent="center"
            alignItems="stretch"
            spacing={1}
            padding={0}
        >
            <TextField
                required
                label="Tool Name"
                name="name"
                size="small"
                fullWidth
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={() => formik.handleSubmit()}
                onKeyDown={(event) => {
                    let REGEX = /^[a-zA-Z_]+$/;
                    if (!REGEX.test(event.key)) {
                        event.preventDefault()
                    }
                }}
                error={Boolean(formik.errors?.name)}
                helperText={formik.errors?.name}
            />
            <TextField
                required
                label="Tool Description"
                name="description"
                size="small"
                fullWidth
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={() => formik.handleSubmit()}
                error={Boolean(formik.errors?.description)}
                helperText={formik.errors?.description}
            />
            {!noProperty &&
                <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="stretch"
                    spacing={1}
                    padding={0}
                >
                    {formik.values.properties.map((props, index) => (
                        <PropertyForm key={`ToolUseProperty-${index}`}
                            index={index}
                            formik={formik}
                        />
                    ))}
                </Stack>
            }
        </Stack>
    )
}

/**
 * 
 * @param props 
 * @returns 
 */
function PropertyForm(props: { index: number, formik: FormikProps<LLMCallFunction> }): React.ReactNode {
    const { index, formik } = props;
    const theme = useTheme();

    // handle remove properties
    const handleRemoveProperty = useCallback<React.MouseEventHandler<HTMLButtonElement>>((event) => {
        event.preventDefault();
        let properties = formik.values.properties;
        if (properties.length > 0) {
            properties.splice(index, 1);
            formik.setFieldValue("properties", properties);
        }
    }, [formik])

    return (
        <Grid2 container
            component={Paper}
            sx={{ backgroundColor: theme.palette.background.default }}
            spacing={1}
            padding={2}
        >
            <Grid2 size={5}>
                <TextField
                    required
                    size="small"
                    fullWidth
                    label="Property Name"
                    name={`properties[${index}].name`}
                    value={formik.values.properties[index].name}
                    onChange={formik.handleChange}
                    onBlur={() => formik.handleSubmit()}
                    error={Boolean(getIn(formik.errors, `properties[${index}].name`))}
                    helperText={getIn(formik.errors, `properties[${index}].name`)}
                />
            </Grid2>
            <Grid2 size={3}>
                <TextField
                    required
                    size="small"
                    fullWidth
                    label="Property Type"
                    name={`properties[${index}].type`}
                    value={formik.values.properties[index].type}
                    onChange={formik.handleChange}
                    onBlur={() => formik.handleSubmit()}
                    error={Boolean(getIn(formik.errors, `properties[${index}].type`))}
                    helperText={getIn(formik.errors, `properties[${index}].type`)}
                />
            </Grid2>
            <Grid2 size={3}>
                <FormControlLabel
                    label="Required:"
                    labelPlacement="start"
                    control={<Checkbox />}
                    name={`properties[${index}].required`}
                    checked={formik.values.properties[index].required}
                    onChange={(e, checked) => {
                        formik.setFieldValue(`properties[${index}].required`, checked);
                    }}
                    onBlur={() => formik.handleSubmit()}
                />
            </Grid2>
            <Grid2 size={1}>
                <Tooltip title={<Typography variant="h5">Remove</Typography>}>
                    <IconButton
                        size="small"
                        onClick={handleRemoveProperty}
                    >
                        <Delete />
                    </IconButton>
                </Tooltip>
            </Grid2>
            <Grid2 size={12}>
                <TextField
                    required
                    size="small"
                    fullWidth
                    label="Property Description"
                    name={`properties[${index}].description`}
                    value={formik.values.properties[index].description}
                    onChange={formik.handleChange}
                    onBlur={() => formik.handleSubmit()}
                    error={Boolean(getIn(formik.errors, `properties[${index}].description`))}
                    helperText={getIn(formik.errors, `properties[${index}].description`)}
                />
            </Grid2>
        </Grid2>
    )
}