/**
 * add toolbox component
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useEffect } from "react";
import {
    Divider,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { Node, useReactFlow } from "reactflow";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { vscodeDark } from "@uiw/codemirror-theme-vscode"
import { useFormik } from "formik";
import { PythonCallSystNodeProps, schema } from "./typedef";
import { useWorkSpace } from "@/components/WorkFlow/provider";
import Main from ".";


/**
 * Python call function component
 * @param props
 * @returns
 */
export default function PythonCallSystForm(
    props: Node & { data: PythonCallSystNodeProps["data"] }
): React.ReactNode {
    const { options } = useWorkSpace();
    const { setNodes } = useReactFlow();

    // handle state
    const formik = useFormik({
        initialValues: { ...schema.getDefault(), ...props.data },
        validationSchema: schema,
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
    }, [formik, setNodes]);

    return (
        <div
            style={{
                display: "block",
                width: "100%",
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
                <TextField
                    required
                    select
                    fullWidth
                    label="environment"
                    name="env"
                    size="small"
                    value={formik.values.env}
                    onChange={formik.handleChange}
                    InputProps={{
                        style: { backgroundColor: "#FFF" },
                    }}
                >
                    {options.envs.map((env, ind) => (
                        <MenuItem key={ind} value={env}>
                            {env}
                        </MenuItem>
                    ))}
                </TextField>
                <CodeMirror
                    id={`${props.id}-code`}
                    aria-hidden={false}
                    maxHeight="64vh"
                    theme={vscodeDark}
                    value={formik.values.code}
                    extensions={[python()]}
                    onChange={(val) => formik.setFieldValue("code", val)}
                />
            </Stack>
        </div>
    );
}
