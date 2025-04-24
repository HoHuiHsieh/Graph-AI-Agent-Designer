/**
 * @fileoverview This file defines the HandoffsEditor component, which is used to edit the handoffs of a node in a React Flow diagram.
 * 
 * @author HoHuiHsieh<billhsies@gmail.com>
 */
import React from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    Select,
    MenuItem,
    TextField
} from "@mui/material";
import { WINDOW_SIZE, WindowSizeType } from "../type";
import { usePanel } from "../provider";
import OpenAICredentialEditor from "./editors/OpenAICredentialEditor";
import PostgreSQLCredentialEditor from "./editors/PostgreSQLCredentialEditor";
import { ExpandMoreSharp } from "@mui/icons-material";


interface CredentialEditorProps {
    open: boolean;
    onClose: () => void;
}

/**
 * CredentialEditor component for editing credentials.
 * @param props 
 * @returns 
 */
export function CredentialEditor(props: CredentialEditorProps): React.ReactNode {
    const { credentials, setCredentials } = usePanel();
    const { open, onClose } = props;
    const [size, setSize] = React.useState<WindowSizeType>("md");
    const handleClose = (event: React.MouseEventHandler<HTMLButtonElement> | {}) => {
        onClose();
    }
    return (
        <Dialog
            maxWidth={size}
            fullWidth
            open={open}
            onClose={handleClose}
            style={{ zIndex: 1001 }}
        >
            <DialogTitle>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    padding={2}
                >
                    {/* Dialog title */}
                    <TextField
                        label="Node Name"
                        variant="outlined"
                        size="small"
                        value="Credential Editor"
                    />

                    {/* Optional maxWidth selector */}
                    <Select
                        variant="filled"
                        value={size}
                        onChange={(e) => setSize(e.target.value as WindowSizeType)}
                        size="small"
                        style={{ minWidth: 120 }}
                        MenuProps={{
                            PaperProps: {
                                style: { zIndex: 1002 },
                            },
                        }}
                    >
                        {WINDOW_SIZE.map((size) => (
                            <MenuItem key={size} value={size}>
                                width: {size.toUpperCase()}
                            </MenuItem>
                        ))}
                    </Select>
                </Stack>
            </DialogTitle>
            <DialogContent>
                {/* Dialog content */}
                <Stack
                    direction="column"
                    justifyContent="flex-start"
                    alignItems="stretch"
                    spacing={0}
                    padding={2}
                >
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreSharp />}>
                            OpenAI
                        </AccordionSummary>
                        <AccordionDetails>
                            <OpenAICredentialEditor
                                value={credentials.openai || []}
                                onChange={(newValue) => {
                                    setCredentials((prev) => ({
                                        ...prev,
                                        openai: newValue,
                                    }));
                                }}
                            />
                        </AccordionDetails>
                    </Accordion>
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreSharp />}>
                            PostgreSQL
                        </AccordionSummary>
                        <AccordionDetails>
                            <PostgreSQLCredentialEditor
                                value={credentials.postgresql || []}
                                onChange={(newValue) => {
                                    setCredentials((prev) => ({
                                        ...prev,
                                        postgresql: newValue,
                                    }));
                                }}
                            />
                        </AccordionDetails>
                    </Accordion>
                </ Stack>
            </DialogContent>
            <DialogActions>
                {/* Save button */}
                <Button onClick={handleClose} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}