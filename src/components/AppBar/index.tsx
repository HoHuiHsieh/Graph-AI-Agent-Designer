/**
 * @fileoverview This component represents the header of the React Flow Application.
 * 
 * @author HoHuiHsieh<billhsies@gmail.com>
 */
import React, { useState } from "react";
import { MenuOpen } from "@mui/icons-material";
import { AppBar, IconButton, Toolbar, Typography, Button, useTheme } from "@mui/material";
import { useReactFlow } from "reactflow";
import { usePanel } from "../provider";
import { downloadJSON, loadJSON } from "./utils";
import { CredentialEditor } from "./dialogs";


interface HeaderProps {
    open: boolean;
    handleDrawerOpen: () => void;
}

/**
 * Header component renders the application header with buttons for loading, downloading JSON,
 * and opening the credential editor.
 * It also validates the JSON structure before loading it into the application.
 * @param props 
 * @returns 
 */
export default function Header(props: HeaderProps): React.ReactNode {
    const { open, handleDrawerOpen } = props;
    const theme = useTheme();
    const { getNodes, getEdges, setEdges, setNodes } = useReactFlow();
    const { credentials, setCredentials } = usePanel();
    const [isCredentialEditorOpen, setCredentialEditorOpen] = useState(false);

    const handleCredentialEditorOpen = () => setCredentialEditorOpen(true);
    const handleCredentialEditorClose = () => setCredentialEditorOpen(false);

    /**
     * Validates the JSON structure.
     */
    const validateJSON = (json: any): boolean => {
        if (Array.isArray(json.nodes) && Array.isArray(json.edges)) {
            const isValidNodes = json.nodes.every((node: any) =>
                typeof node.id === "string" &&
                typeof node.type === "string" &&
                typeof node.position === "object" &&
                typeof node.position.x === "number" &&
                typeof node.position.y === "number"
            );

            const isValidEdges = json.edges.every((edge: any) =>
                typeof edge.id === "string" &&
                typeof edge.source === "string" &&
                typeof edge.target === "string"
            );

            const isValidCredentials = json.credentials && typeof json.credentials === "object";

            return isValidNodes && isValidEdges && isValidCredentials;
        }
        return false;
    };

    /**
     * Handle the load JSON button click event.
     */
    const handleLoad: React.MouseEventHandler<HTMLButtonElement> = () => {
        loadJSON((json) => {
            if (validateJSON(json)) {
                console.log("Loaded JSON:", json);
                setNodes(json.nodes);
                setEdges(json.edges);
                setCredentials(json.credentials);
            } else {
                console.error("Invalid JSON structure");
            }
        });
    };

    /**
     * Handle the download JSON button click event.
     */
    const handleDownload = () => {
        try {
            const nodes = getNodes();
            const edges = getEdges();
            const date = new Date(new Date().getTime() + 8 * 60 * 60 * 1000); // Adjust to UTC+8 timezone
            const dateTime = date.toISOString().replace(/[:.]/g, "-");
            const filename = `react-flow-data-${dateTime}.json`;
            downloadJSON({ nodes, edges, credentials }, filename);
        } catch (error) {
            console.error("Error during download:", error);
        }
    };

    const buttonStyles = {
        marginRight: 1,
        bgcolor: theme.palette.background.paper,
        "&:hover": {
            bgcolor: theme.palette.primary.dark,
            color: theme.palette.background.paper,
        },
    };

    const secondaryButtonStyles = {
        ...buttonStyles,
        color: theme.palette.secondary.main,
        "&:hover": {
            bgcolor: theme.palette.secondary.dark,
        },
    };

    return (
        <AppBar position="fixed" component="div" style={{ zIndex: 900 }} >
            <Toolbar>
                <Typography variant="h6" noWrap sx={{ flexGrow: 1 }} component="div">
                    ReactFlow + LangGraph Application
                </Typography>

                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleCredentialEditorOpen}
                    sx={{
                        ...buttonStyles,
                        color: theme.palette.primary.main,
                    }}
                >
                    Credentials
                </Button>
                <Button
                    variant="outlined"
                    onClick={handleLoad}
                    sx={{
                        ...buttonStyles,
                        color: theme.palette.primary.main,
                    }}
                >
                    Load JSON
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleDownload}
                    sx={secondaryButtonStyles}
                >
                    Download JSON
                </Button>

                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="end"
                    onClick={() => handleDrawerOpen()}
                    sx={[open && { display: "none" }]}
                >
                    <MenuOpen />
                </IconButton>
            </Toolbar>
            <CredentialEditor
                open={isCredentialEditorOpen}
                onClose={handleCredentialEditorClose}
            />
        </AppBar>
    );
};