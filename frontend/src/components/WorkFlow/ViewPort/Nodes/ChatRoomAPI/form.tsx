/**
 * add toolbox component
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useEffect } from "react";
import {
  Divider, TextField, Typography, Stack, Paper,
  FormControl, FormGroup, FormControlLabel, Checkbox,
} from "@mui/material";
import { getIncomers, Node, useReactFlow } from "reactflow";
import { FormikProps, useFormik } from "formik";
import { apiSchema, ChatRoomAPINodeProps, schema } from "./typedef";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import Main from ".";



/**
 * chatroom-api component
 * @param props
 * @returns
 */
export default function ChatRoomAPIForm(
  props: Node & { data: ChatRoomAPINodeProps["data"] }
): React.ReactNode {
  const { setNodes, getNode, getNodes, getEdges } = useReactFlow();

  // handle state
  const formik = useFormik<ChatRoomAPINodeProps["data"]>({
    initialValues: {
      ...schema.getDefault(),
      ...(props.data || {})
    },
    validationSchema: schema,
    validateOnChange: true,
    onSubmit: () => { },
  });

  // initialize
  useEffect(() => {
    if (!props.id) { return }
    const thisNode = getNode(props.id);
    if (!thisNode) { return }
    const sources = getIncomers(thisNode, getNodes(), getEdges())

    // - functions
    const funcs: ChatRoomAPINodeProps["data"]["functions"] = sources.flatMap(s => {
      if (s.data?.functions) {
        let funcs: ChatRoomAPINodeProps["data"]["functions"] = s.data?.functions;
        return funcs.map(e => ({ name: e.name }))
      }
      if (s.data?.documents) {
        let docs: { function?: string }[] = s.data?.documents;
        return docs.reduce((names, doc) => {
          try {
            if (doc?.function) {
              let func = JSON.parse(doc.function);
              if (!names.some(e => e.name === func.name)) {
                names.push({ name: func.name });
              }
            }
          } catch (error) {
          }
          return names
        }, [] as any[])
      }
      return []
    }, [])
    formik.setFieldValue("functions", funcs);

    // - apis for each function 
    const apis = funcs.reduce((out, func) => {
      let key = func.name;
      if (key in (props.data?.apis || {})) {
        return { ...out, [key]: props.data.apis[key] }
      }
      return { ...out, [key]: apiSchema.getDefault() }
    }, {});
    formik.setFieldValue("apis", apis);
  }, [getEdges, getNode, getNodes,])

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
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="stretch"
        spacing={1}
        style={{
          margin: 10
        }}
      >
        {(formik.values.functions || []).map((func, f_index) => (
          <FunctionCard key={f_index}
            formik={formik}
            func={func}
          />
        ))}
      </Stack >
    </div>
  );
}


interface FunctionCardProps {
  formik: FormikProps<ChatRoomAPINodeProps["data"]>,
  func: ChatRoomAPINodeProps["data"]["functions"][0],
}


/**
 * 
 * @param props 
 * @returns 
 */
function FunctionCard(props: FunctionCardProps): React.ReactNode {
  const { formik, func } = props;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    const key = event.target.name;
    formik.setFieldValue(`apis[${func.name}][${key}][checked]`, checked);
  };

  const api = formik.values.apis[func.name] || {};

  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="stretch"
      spacing={1} m={4} p={1}
      component={Paper}
    >
      <TextField
        required
        label="function"
        size="small"
        fullWidth
        value={func.name}
        aria-readonly={true}
      />
      <FormControl
        component="fieldset"
        variant="standard"
      >
        <FormGroup>
          {Object.keys(api).map((key, index) => (
            <FormControlLabel key={index}
              control={
                <Checkbox
                  checked={(api as any)[key].checked}
                  onChange={handleChange}
                  name={key}
                  icon={<CheckBoxOutlineBlank style={{ fill: "#000" }} />}
                  checkedIcon={<CheckBox style={{ fill: "#000" }} />}
                />
              }
              label={(api as any)[key].label}
            />
          ))}
        </FormGroup>
      </FormControl>
    </Stack>
  )
}
