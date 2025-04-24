/**
 * @fileoverview CodeEditor component using Monaco Editor.
 * Provides a configurable code editor with customizable language, theme, and height.
 * 
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React, { useRef } from "react";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import Editor, { OnChange, OnMount, EditorProps } from "@monaco-editor/react";


/**
 * CodeEditor Component
 * 
 * @param props - Component properties
 * @returns  A Monaco Editor instance
 */
export function CodeEditor(props: EditorProps) {
    // Reference to the editor instance
    const editorInstanceRef = useRef(null);

    // Callback when the editor is mounted
    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorInstanceRef.current = editor;
    };

    return (
        <Editor 
            theme="vs-dark"
            height="50vh"
            defaultLanguage="javascript"
            onMount={handleEditorDidMount}
            {...props}
        />
    );
}


interface InDialogCodeEditorProps {
    open: boolean; // Whether the dialog is open
    onClose: () => void; // Function to close the dialog
    editorProps: EditorProps; // Props for the Monaco Editor
}

/**
 * InDialogCodeEditor Component 
 * This component wraps the CodeEditor in a dialog, allowing for a modal editing experience.
 * @param param0 
 */
export function InDialogCodeEditor(props: InDialogCodeEditorProps) {
    const { open, onClose, editorProps } = props;
    return (
        <Dialog open={Boolean(open)} onClose={onClose} fullWidth maxWidth="md">
            <DialogContent>
                <CodeEditor {...editorProps} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    )
}