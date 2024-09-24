/**
 * add toolbox component
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useRef, useCallback, useEffect } from "react";
import {
  Divider,
  InputAdornment,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { FileUploadOutlined, } from "@mui/icons-material";
import { Node, useReactFlow } from "reactflow";
import { useFormik } from "formik";
import { TextFileInstNodeProps, schema } from "./typedef";
import Main from ".";


/**
 * text file component
 * @param props
 * @returns
 */
export default function TextFileInstForm(
  props: Node & { data: TextFileInstNodeProps["data"] }
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

  // handle select file
  const handleUpload: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      if (event.target.files == null) {
        return;
      }
      event.preventDefault();
      let reader = new FileReader();
      let file = event.target.files[0];
      if (!file) { return }
      reader.onloadend = async () => {
        const content = await file.text();
        formik.setFieldValue("content", content);
        formik.setFieldValue("filename", file.name);
        formik.setFieldValue("output", {
          instruction: [
            { role: "user", content: `Read file: ${file.name}` },
            { role: "assistant", content },
          ]
        });
      };
      reader.readAsDataURL(file);
    },
    [formik]
  );

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
        label="filename"
        name="filename"
        size="medium"
        fullWidth
        style={{ margin: "8px" }}
        value={formik.values.filename}
        onChange={formik.handleChange}
        InputProps={{
          style: { backgroundColor: "#FFF" },
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => inputFile.current?.click()} edge="end">
                <FileUploadOutlined />
              </IconButton>
            </InputAdornment>
          ),
          readOnly: true,
        }}
      />
      <TextField
        label="text"
        name="text"
        size="medium"
        fullWidth
        multiline
        minRows={10}
        maxRows={20}
        style={{ margin: "8px" }}
        value={formik.values.content}
        InputProps={{
          readOnly: true,
          style: { backgroundColor: "#FFF" },
        }}
      />
      <input
        hidden
        type="file"
        accept=".txt,.md"
        onChange={handleUpload}
        ref={inputFile}
      />
    </div>
  );
}

