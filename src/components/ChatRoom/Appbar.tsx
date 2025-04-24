/**
 * @fileoverview ChatRoom component for handling chat interactions and workflows.
 * 
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React from "react";
import { AppBar, Box, Toolbar, IconButton, Typography, Container, Tooltip } from "@mui/material";
import { ChatBubble, DisabledByDefault } from "@mui/icons-material";


interface AppbarProps {
    onClose: () => void;
}

/**
 * Appbar component renders the application bar with a title and buttons.
 * @param param0 
 * @returns 
 */
export default function Appbar({ onClose }: AppbarProps): React.ReactNode {

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* Chat Icon */}
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        sx={{ mr: 2 }}
                    >
                        <ChatBubble fontSize="large" />
                    </IconButton>

                    {/* Title */}
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        sx={{
                            mr: 2,
                            display: "flex",
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Chat with Agent
                    </Typography>

                    {/* Close Icon */}
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Exit chat room">
                            <IconButton
                                size="large"
                                edge="start"
                                color="warning"
                                onClick={() => onClose()} sx={{ p: 0 }}
                            >
                                <DisabledByDefault fontSize="large" />
                            </IconButton>
                        </Tooltip>
                    </Box>

                </Toolbar>
            </Container>
        </AppBar>
    );
}