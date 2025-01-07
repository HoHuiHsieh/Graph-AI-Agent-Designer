/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useState } from "react";
import { Button, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import { PictureAsPdf } from "@mui/icons-material";
import { Node, NodeProps, useReactFlow } from "reactflow";
import { ToolSourceHandle } from "../../Common/Handles";
import { v4 } from "uuid";
import SetupDialog from "./dialog";


export interface PDFToolNodeProps extends NodeProps {
    data: {
        name: string,
        description: string,
        properties: {
            name: string,
            type: string,
            description: string,
            required: boolean,
        }[],
        checksum: string,
        filename: string,
        prompt: string,
        state?: "pending" | "completed",
    }
}

export const PDFToolIcon = <PictureAsPdf />;
export const PDFToolLabel = "PDF File";

/**
 * 
 * @param props 
 * @returns 
 */
export default function PDFToolNode(props: PDFToolNodeProps): React.ReactNode {
    const { setNodes } = useReactFlow();
    const theme = useTheme();

    // handle change data
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = (value: any) => {
        setNodes((nodes) => nodes.map((node) => {
            if (node.id == props.id) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        ...(value || {})
                    }
                }
            }
            return node
        }))
        setOpen(false);
    }

    return (
        <div id={`node-${props.id}`} >
            <ToolSourceHandle id="tool" type="source" />
            <Tooltip
                title={(<Typography variant="h5">{PDFToolLabel}</Typography>)}
                placement="bottom"
            >
                <IconButton onClick={handleOpen} >
                    <PictureAsPdf fontSize="medium" sx={{ fill: theme.palette.primary.main }} />
                </IconButton>
            </Tooltip>
            <SetupDialog id={`PDFToolDialog-${props.id}`}
                node={props}
                open={open}
                handleClose={handleClose}
            />
        </div>
    )
}

export function getDefaultPDFToolNode(props: any): Node {
    const { id, position } = (props || {});
    return {
        id: id || v4(),
        type: "PDFTool",
        data: {
            name: "read_newspaper",
            description: "Get newspaper content from PDF file.",
            properties:[{
                name: "keyword",
                type: "string",
                description: "Words find in the newspaper.",
                required: true,
            }],
            checksum: "",
            filename: "",
            prompt: "Newspaper content:\n'''\n{{ content }}\n'''",
            state: "pending",
        } as PDFToolNodeProps["data"],
        position: position || { x: 0, y: 0 },
        style: {
            background: "#FFF",
            border: "1px solid black",
            borderRadius: 20,
            fontSize: 12,
            padding: 8,
            width: 40,
            height: 40,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
    }
}