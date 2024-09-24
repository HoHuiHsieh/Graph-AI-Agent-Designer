/**
 * add toolbox component
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useRef, useEffect } from "react";
import { Divider, Typography, } from "@mui/material";
import { Node, useReactFlow } from "reactflow";
import { useFormik } from "formik";
import { MemoryInstNodeProps, schema } from "./typedef";
import Main from ".";


/**
 * LLM short memory component
 * @param props
 * @returns
 */
export default function MemoryInstForm(
  props: Node & { data: MemoryInstNodeProps["data"] }
): React.ReactNode {
  const { setNodes } = useReactFlow();
  const inputFile = useRef<HTMLInputElement | null>(null);

  // handle state
  const formik = useFormik({
    initialValues: {
      ...schema.getDefault(),
      ...(props.data || {}),
    },
    validationSchema: schema,
    onSubmit: () => { },
  });

  useEffect(() => {
    return () =>
      setNodes((nodes) => {
        // change node value
        const index = nodes.findIndex((e) => e.id == props.id);
        if (index > -1) {
          nodes[index].data = formik.values
        }
        return nodes;
      });
  }, [formik, setNodes]);


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
    </div>
  );
}
