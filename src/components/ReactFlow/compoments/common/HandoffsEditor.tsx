/**
 * @fileoverview This file defines the HandoffsEditor component, which is used to edit the handoffs of a node in a React Flow diagram.
 * 
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React from "react";
import { Stack, TextField, Tooltip, Typography, useTheme, Switch, FormControlLabel, FormHelperText } from "@mui/material";
import { BaseHandoffType } from "../../../../types/nodes";
import { ModelEditor } from "./ModelEditor";
import { InDialogCodeEditor } from "./CodeEditor";



// Define the props for the CodeEditor component
interface HandoffsEditorProps {
    value: BaseHandoffType;
    onChange: (value: BaseHandoffType) => void;
}


/**
 * HandoffsEditor component
 * @param props 
 * @returns 
 */
export default function HandoffsEditor(props: HandoffsEditorProps) {
    const theme = useTheme();
    const { value, onChange } = props;

    // State to manage dialog open/close
    const [dialogOpen, setDialogOpen] = React.useState<BaseHandoffType["items"][0]>();
    const handleDialogOpen = (item: BaseHandoffType["items"][0]) => {
        setDialogOpen(item);
    };
    const handleDialogClose = () => {
        setDialogOpen(undefined);
    };

    // Render the component
    if (Array.isArray(value.items) && value.items.length > 0) {
        return (
            <Stack
                direction="column"
                spacing={2}
                sx={{
                    justifyContent: "flex-start",
                    alignItems: "stretch",
                    backgroundColor: theme.palette.background.paper,
                }}
            >
                <FormControlLabel
                    control={
                        <Switch
                            checked={Boolean(value.useAi)}
                            onChange={(event) => {
                                onChange({ ...value, useAi: event.target.checked || false });
                            }}
                        />
                    }
                    label="Let AI Decide"
                />
                {value.useAi &&
                    <ModelEditor
                        credName={value?.credName}
                        setCredName={(credName) => {
                            onChange({ ...value, credName });
                        }}
                        model={value?.model}
                        setModel={(model) => {
                            onChange({ ...value, model });
                        }}
                        simplify={true}
                    />
                }
                {!value.useAi && value.items.map((item, index) => (
                    <Stack key={index} direction="row" spacing={.5} alignItems="center">
                        <TextField
                            label="Priority"
                            variant="outlined"
                            size="small"
                            type="number"
                            value={index + 1}
                            onChange={(newIndex) => {
                                let newItems = [...value.items];
                                const [removedItem] = newItems.splice(index, 1);
                                newItems.splice(Number(newIndex.target.value) - 1, 0, removedItem);
                                onChange({ ...value, items: newItems });
                            }}
                            style={{
                                width: "inherit",
                                marginRight: "4px",
                            }}
                        />

                        <TextField
                            label={item.name}
                            fullWidth
                            variant="outlined"
                            size="small"
                            placeholder="Click icon to edit ➡️"
                            value={item.express}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <Tooltip title={<Typography>Click to edit</Typography>}>
                                            <button
                                                onClick={() => handleDialogOpen(item)}
                                                style={{
                                                    background: "none",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    padding: 0,
                                                }}
                                            >
                                                <span role="img" aria-label="edit">
                                                    ✏️
                                                </span>
                                            </button>
                                        </Tooltip>
                                    ),
                                }
                            }}
                        />
                    </Stack>
                ))}

                {!value.useAi &&
                    <>
                        <p><strong>Tips:</strong></p>
                        <p>1. The code should return in true or false.</p>
                        <p>2. You can use <code>{'{{ $("NodeName").json }}'}</code> to access the node data.</p>
                    </>
                }


                <InDialogCodeEditor
                    open={Boolean(dialogOpen)}
                    onClose={handleDialogClose}
                    editorProps={{
                        height: "50vh",
                        theme: "vs-dark",
                        defaultLanguage: "javascript",
                        defaultValue: dialogOpen?.express,
                        onChange: (e) => {
                            let cond = value.items?.find((item) => item.name === dialogOpen?.name);
                            cond.express = e;
                            onChange(value);
                        },
                        options: {
                            lineNumbers: "on",
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            wordWrap: "on",
                        }
                    }}
                />
            </Stack>
        )
    }
    return (
        <Typography
            variant="body2"
            color="textSecondary"
        >
            There is no need to configure handoffs.
        </Typography>
    );
}
