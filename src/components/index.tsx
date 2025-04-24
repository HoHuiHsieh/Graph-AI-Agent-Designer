"use client"
/**
 * @fileoverview This file contains the main AppContainer component which serves as the entry point for the React Flow application.
 * It utilizes the ReactFlowProvider to wrap the ReactFlowViewPort component.
 * 
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useState } from "react";
import { Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import { ReactFlowProvider } from "reactflow";
import ReactFlowViewPort from "./ReactFlow";
import { PanelProvider } from "./provider";
import AppBar from "./AppBar";
import ItemList from "./ItemList";

/**
 * Main container component for the application.
 * @returns The AppContainer component.
 */
export default function AppContainer(): React.ReactNode {
    const [open, setOpen] = useState<boolean>(false);

    const handleDrawerOpen = (): void => setOpen(true);
    const handleDrawerClose = (): void => setOpen(false);

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: "flex" }}>
                <PanelProvider>
                    <ReactFlowProvider>
                        <AppBar open={open} handleDrawerOpen={handleDrawerOpen} />
                        <ReactFlowViewPort />
                        <ItemList open={open} handleDrawerClose={handleDrawerClose} />
                    </ReactFlowProvider>
                </PanelProvider>
            </Box>
        </ThemeProvider>
    );
}
