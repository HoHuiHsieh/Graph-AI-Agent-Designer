/**
 * base node component
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useEffect, useState } from "react";
import { Box, Dialog, IconButton, styled, TextField, BoxProps, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { CancelOutlined, QuestionAnswerOutlined } from "@mui/icons-material";
import { NodeToolbar, getIncomers, useReactFlow, HandleType, Node } from "reactflow";
import NodeHandle from "./NodeHandle";
import ProgressBadge from "./ProgressBadge";
import { mergeSources } from "../utils";


export interface NodeHandleProps {
    id?: "system" | "instruction" | "prompt" | "assistant" | "function",
    type: HandleType
    datatype: "system" | "instruction" | "prompt" | "assistant" | "function"
    shift: number,
    maxConnections: number,
}

interface BaseNodeProps {
    id: string,
    children: React.ReactNode,
    handlers: NodeHandleProps[],
    BoxProps?: BoxProps,
    loading?: boolean,
    isValid?: boolean,
    info?: string
}

// styled node box
const NodeBox = styled(Box)(({ theme }) => ({
    display: "flex",
    width: "15rem",
    height: "5rem",
    boxSizing: "border-box",
    alignItems: "center",
    justifyContent: "center",
    padding: 1,
    paddingLeft: 2,
    color: theme.palette.common.black,
    backgroundColor: theme.palette.common.white,
    border: "1px solid",
    borderRadius: 8,
    borderColor: theme.palette.primary.dark,
}));

/**
 * base node component
 * @param props 
 * @returns 
 */
export default function BaseNode(props: BaseNodeProps): React.ReactNode {
    const { setNodes, setEdges, getNode, getNodes, getEdges } = useReactFlow();

    // handle dialog
    const [open, setOpen] = useState<boolean>(false);
    const [info, setInfo] = useState<Node>();
    const [value, setValue] = React.useState("1");
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };
    const getBaseNode = () => {
        let { data, ...base } = (info || {});
        return JSON.stringify(base, null, "\t")
    }
    const getNodeData = () => {
        let { data, ...base } = (info || {});
        let { input, output, ...props } = (data || {});
        return JSON.stringify(props || {}, null, "\t")
    }
    const getNodeInput = () => {
        let { data, ...base } = (info || {});
        let { input } = (data || {});
        return JSON.stringify(input || {}, null, "\t")
    }
    const getNodeOutput = () => {
        let { data, ...base } = (info || {});
        let { output } = (data || {});
        return JSON.stringify(output || {}, null, "\t")
    }
    useEffect(() => {
        if (open) {
            const thisNode = getNode(props.id);
            if (!thisNode) { return };
            const sources = thisNode ? getIncomers(thisNode, getNodes(), getEdges()) : [];
            const input = mergeSources(sources.map(e => e.data?.output));
            const data = {
                ...thisNode,
                id: props.id,
                data: {
                    ...(thisNode?.data || {}),
                    input
                }
            }
            // setInfo(JSON.stringify(data, null, "\t"))
            setInfo(data)
        }
    }, [open, setInfo, getNode, getNodes, getEdges])

    // add connection handlers
    const sourceHandlers = props.handlers.filter(e => e.type == "source");
    const targetHandlers = props.handlers.filter(e => e.type == "target");

    return (
        <NodeBox {...props.BoxProps} >
            {sourceHandlers.map((e, index) => (
                <NodeHandle key={index} {...e} />
            ))}
            {props.children}
            {targetHandlers.map((e, index) => (
                <NodeHandle key={index} {...e} />
            ))}
            <ProgressBadge isValid={props.isValid} />
            <NodeToolbar>
                <IconButton
                    style={{ transform: "translate(0,10px)" }}
                    onClick={() => setOpen(true)}
                >
                    <QuestionAnswerOutlined fontSize="medium" color="info" />
                </IconButton>
                <IconButton
                    style={{ transform: "translate(0,10px)" }}
                    onClick={() => {
                        setNodes((es) => es.filter((e) => e.id !== props.id));
                        setEdges((es) => es.filter((e) => (e.source !== props.id) && (e.target !== props.id)));
                    }}
                >
                    <CancelOutlined fontSize="medium" color="warning" />
                </IconButton>
            </NodeToolbar>
            <Dialog
                fullWidth
                onClose={() => setOpen(false)}
                open={open}
            >
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                            <Tab label="Base" value="1" />
                            <Tab label="Data" value="2" />
                            <Tab label="Input" value="3" />
                            <Tab label="Output" value="4" />
                        </TabList>
                    </Box>
                    <TabPanel value="1">
                        <TextField
                            fullWidth
                            multiline
                            value={getBaseNode()}
                            maxRows={30}
                        />
                    </TabPanel>
                    <TabPanel value="2">
                        <TextField
                            fullWidth
                            multiline
                            value={getNodeData()}
                            maxRows={30}
                        />
                    </TabPanel>
                    <TabPanel value="3">
                        <TextField
                            fullWidth
                            multiline
                            value={getNodeInput()}
                            maxRows={30}
                        />
                    </TabPanel>
                    <TabPanel value="4">
                        <TextField
                            fullWidth
                            multiline
                            value={getNodeOutput()}
                            maxRows={30}
                        />
                    </TabPanel>
                </TabContext>
            </Dialog>
        </NodeBox>
    )
};
