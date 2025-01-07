/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useCallback, useRef, ChangeEventHandler, MouseEventHandler, useState, useEffect } from "react";
import { AppBar, Box, IconButton, Stack, styled, TextField, Toolbar, Typography } from "@mui/material";
import { FaceRetouchingNatural, UploadFile, Download, Add } from "@mui/icons-material";
import { download, upload } from "./utils";
import { useReactFlow } from "reactflow";
import { DiagramData } from "./typedef";


// styled header
const HeaderBox = styled(Box)(({ theme }) => ({
    width: "100%",
    height: "9vh",
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
}))

// styled header appbar
const HeadeAppBar = styled(AppBar)(({ theme }) => ({
    position: "static",
    justifyContent: "center",
    backgroundColor: theme.palette.background.paper,
}))

// styled logo
const Logo = styled(FaceRetouchingNatural)(({ theme }) => ({
    fontSize: 60,
    marginLeft: 0,
    marginRight: 10,
    color: theme.palette.primary.main
}))

/**
 * header component
 * @returns 
 */
export default function Header(props: { height: string }): React.ReactNode {
    const [filename, setFilename] = useState("");
    const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();

    // handle add new file
    const handleNewFile: MouseEventHandler<HTMLButtonElement> = useCallback((event) => {
        event.preventDefault();
        window.location.reload();
    }, []);

    // handle download workflow file
    const handleDownload: MouseEventHandler<HTMLButtonElement> = useCallback((event) => {
        if (!filename) { return; }
        event.preventDefault()
        try {
            let diagram = {
                nodes: getNodes(),
                edges: getEdges(),
            }
            download(document, filename, diagram);
        } catch (error) {
            console.log(error);
        }
    }, [filename, getNodes, getEdges])

    // handle upload workflow file
    const [uploadFlag, setUploadFlag] = useState<DiagramData>(null);
    const inputFile = useRef<HTMLInputElement | null>(null);
    const handleUpload: ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
        if (event.target.files == null) { return; }
        event.preventDefault();
        try {
            let reader = new FileReader();
            let file = event.target.files[0];
            upload(reader, file, (data, file) => {
                setFilename(file.name);
                setUploadFlag(data);
            })
        } catch (error) {
            console.error(error);
        }
    }, [setFilename, setUploadFlag]);
    useEffect(() => {
        if (uploadFlag) {
            setNodes(uploadFlag.nodes);
            setEdges(uploadFlag.edges);
        }
    }, [uploadFlag, setNodes, setEdges]);

    return (
        <HeaderBox height={props.height} >
            <HeadeAppBar sx={{ height: "100%" }} >
                <Toolbar>
                    <Logo />
                    <Typography
                        variant="h1"
                        component="div"
                        color="primary"
                        sx={{ flexGrow: 1 }}
                        noWrap
                    >
                        Graph Agentic AI Designer
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Stack
                        direction="row"
                        sx={{
                            justifyContent: "flex-end",
                            alignItems: "center",
                        }}
                        spacing={1}
                    >
                        <IconButton
                            onClick={handleNewFile}
                        >
                            <Add fontSize="large" />
                            <Typography variant="button">
                                New
                            </Typography>
                        </IconButton>
                        <IconButton
                            onClick={() => inputFile.current?.click()}
                        >
                            <UploadFile fontSize="large" />
                            <Typography variant="button">
                                Upload
                            </Typography>
                        </IconButton>
                        <IconButton
                            onClick={handleDownload}
                        >
                            <Download fontSize="large" />
                            <Typography variant="button">
                                Download
                            </Typography>
                        </IconButton>
                        <TextField
                            label="Project"
                            placeholder="Your project name"
                            size="small"
                            value={filename}
                            onChange={(e) => setFilename(e.target.value)}
                            error={filename == ""}
                        />
                        <input
                            id="download_flow"
                            hidden
                            type="file"
                            accept=".json"
                            onChange={handleUpload}
                            ref={inputFile}
                        />
                    </Stack>
                </Toolbar>
            </HeadeAppBar>
        </HeaderBox>
    );
}
