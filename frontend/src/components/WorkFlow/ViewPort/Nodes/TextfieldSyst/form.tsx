/**
 * add toolbox component
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useEffect, useCallback } from "react";
import { Divider, TextField, Typography, } from "@mui/material";
import { Node, useReactFlow } from "reactflow";
import { useFormik } from "formik";
import { TextfieldSystNodeProps, schema } from "./typedef";
import Main from ".";


/**
 * textfield component
 * @param props
 * @returns
 */
export default function TextfieldSystForm(
  props: Node & { data: TextfieldSystNodeProps["data"] }
): React.ReactNode {
  const { setNodes } = useReactFlow();

  // handle state
  const formik = useFormik<TextfieldSystNodeProps["data"]>({
    initialValues: {
      ...schema.getDefault(),
      ...props.data,
    },
    validationSchema: schema,
    onSubmit: () => { },
  });

  // update node on change
  useEffect(() => {
    return () =>
      setNodes((nodes) => {
        // find this node
        const index = nodes.findIndex((e) => e.id == props.id);
        if (index > -1) {
          nodes[index].data = formik.values
        }
        return nodes
      });
  }, [formik, setNodes]);

  // handle change form value
  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      formik.handleChange(event);
      formik.setFieldValue("output", {
        system: [{ role: "system", content: event.target.value }]
      })
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
      <TextField
        label="text"
        name="text"
        size="medium"
        fullWidth
        multiline
        minRows={10}
        maxRows={30}
        style={{ margin: "8px" }}
        value={formik.values.text}
        onChange={handleChange}
        InputProps={{
          style: { backgroundColor: "#FFF" },
        }}
      />
    </div>
  );
}