/**
 * @fileoverview This file defines the HandoffsEditor component, which is used to edit the handoffs of a node in a React Flow diagram.
 * 
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React from "react";
import { Stack, TextField, Typography, useTheme, Switch, FormControlLabel, FormHelperText, FormLabel } from "@mui/material";
import { BaseAIHandoffItemType, BaseAIHandoffType, BaseHandoffType } from "../../../../types/nodes";
import { ModelEditor } from "./ModelEditor";
import { InDialogCodeEditor } from "./CodeEditor";


const defaultPrompt = `You are a helpful AI agent that choose the most appropriate target from the options based on your analysis.

Here are the options: 
{{ $options }}

Invoke tool to select one of the options and provide the target name only.`;


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

    if (!Array.isArray(value.items) || value.items.length <= 1) {
        return (
            <Typography
                variant="body2"
                color="textSecondary"
            >
                Handoff configuration is not required.
            </Typography>
        )
    }
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
                        checked={value.useAi}
                        onChange={(event) => {
                            if (event.target.checked) {
                                onChange({
                                    ...value,
                                    useAi: true,
                                    items: [...value.items as any[]],
                                    credName: "",
                                    model: "",
                                    prompt: "",
                                });
                            } else {
                                onChange({
                                    ...value,
                                    items: [...value.items as any[]],
                                    useAi: true,
                                });
                            }

                        }}
                    />
                }
                label="Let AI Decide"
            />
            {value.items.length > 1 && value.useAi &&
                <AIDecideEditor
                    value={value as BaseAIHandoffType}
                    onChange={(newValue) => {
                        onChange({ ...value, ...newValue });
                    }}
                />
            }

            {value.items.length > 1 && !value.useAi &&
                <FormHelperText>
                    Currently only support manual handoffs.
                </FormHelperText>
            }
        </Stack>
    )
}


interface AIDecideEditorProps {
    value: BaseAIHandoffType;
    onChange: (value: BaseHandoffType) => void;
}

/**
 * AIDecideEditor component
 * @param param0 
 * @returns 
 */
function AIDecideEditor({ value, onChange }: AIDecideEditorProps) {
    const theme = useTheme();
    if (!value.useAi) return null;
    const items = (value?.items || []) as BaseAIHandoffItemType[];  
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
            <TextField
                label="Prompt"
                variant="outlined"
                size="small"
                fullWidth
                value={value?.prompt || defaultPrompt}
                onChange={(e) => {
                    onChange({ ...value, prompt: e.target.value || defaultPrompt });
                }}
                placeholder="Enter your prompt here"
                multiline
                minRows={2}
                slotProps={{
                    input: {
                        style: {
                            backgroundColor: theme.palette.background.paper,
                            borderRadius: 1,
                            overflow: "auto",
                        }
                    }
                }}
            />
            <FormLabel>
                Options
            </FormLabel>
            {items.map((item, index) => (
                <Stack key={index}
                    direction="row"
                    spacing={.5}
                >
                    <Typography
                        variant="body1"
                        color="textSecondary"
                        sx={{
                            width: "30%",
                            textAlign: "right",
                            paddingRight: 1,
                        }}
                    >
                        {item.name}
                    </Typography>
                    <TextField
                        label="Description"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={item.description}
                        onChange={(e) => {
                            let newItems = [...items];
                            newItems[index].description = e.target.value;
                            onChange({ ...value, items: newItems });
                        }}
                        placeholder="Enter your description here"
                        slotProps={{
                            input: {
                                style: {
                                    backgroundColor: theme.palette.background.paper,
                                    borderRadius: 1,
                                }
                            }
                        }}
                    />
                </Stack>
            ))}
        </Stack>
    )
}


// interface ExpressEditorProps {
//     value: BaseExpressHandoffType;
//     onChange: (value: BaseHandoffType) => void;
// }

// /**
//  * 
//  * @param param0 
//  * @returns 
//  */
// function ExpressEditor({ value, onChange }: ExpressEditorProps) {
//     const theme = useTheme();
//     if (value.useAi) return null;

//     const items = (value?.items || []) as BaseExpressHandoffItemType[];

//     // State to manage dialog open/close
//     const [dialogOpen, setDialogOpen] = React.useState<BaseExpressHandoffItemType | null>(null);
//     const handleDialogOpen = (item: BaseExpressHandoffItemType) => {
//         setDialogOpen(item);
//     };
//     const handleDialogClose = () => {
//         setDialogOpen(null);
//     };

//     return (
//         <Stack
//             direction="column"
//             spacing={2}
//             sx={{
//                 justifyContent: "flex-start",
//                 alignItems: "stretch",
//                 backgroundColor: theme.palette.background.paper,
//             }}
//         >
//             {items.map((item, index) => (
//                 <Stack key={index}
//                     direction="row"
//                     spacing={.5}
//                 >

//                     <TextField
//                         label="Priority"
//                         variant="outlined"
//                         size="small"
//                         type="number"
//                         value={index + 1}
//                         onChange={(newIndex) => {
//                             let newItems = [...items];
//                             const [removedItem] = newItems.splice(index, 1);
//                             newItems.splice(Number(newIndex.target.value) - 1, 0, removedItem);
//                             onChange({ ...value, items: newItems });
//                         }}
//                         sx={{
//                             width: "30%",
//                             textAlign: "right",
//                             paddingRight: 1,
//                         }}
//                     />

//                     <TextField
//                         label={item.name}
//                         fullWidth
//                         variant="outlined"
//                         size="small"
//                         placeholder="Click icon to edit ➡️"
//                         value={item.express}
//                         slotProps={{
//                             input: {
//                                 endAdornment: (
//                                     <Tooltip title={<Typography>Click to edit</Typography>}>
//                                         <button
//                                             onClick={() => handleDialogOpen(item)}
//                                             style={{
//                                                 background: "none",
//                                                 border: "none",
//                                                 cursor: "pointer",
//                                                 padding: 0,
//                                             }}
//                                         >
//                                             <span role="img" aria-label="edit">
//                                                 ✏️
//                                             </span>
//                                         </button>
//                                     </Tooltip>
//                                 ),
//                             }
//                         }}
//                     />
//                 </Stack>
//             ))}
//             <FormHelperText>
//                 <p><strong>Tips:</strong></p>
//                 <p>1. The code should return in true or false.</p>
//                 <p>2. You can use <code>{'{{ $json.NodeName }}'}</code> to access the node data.</p>
//             </FormHelperText>
//             <InDialogCodeEditor
//                 open={Boolean(dialogOpen)}
//                 onClose={handleDialogClose}
//                 editorProps={{
//                     height: "50vh",
//                     theme: "vs-dark",
//                     defaultLanguage: "javascript",
//                     defaultValue: dialogOpen?.express || "",
//                     onChange: (e) => {
//                         if (dialogOpen) {
//                             const updatedItems = items.map((item) =>
//                                 item.name === dialogOpen.name ? { ...item, express: e } : item
//                             );
//                             onChange({ ...value, items: updatedItems });
//                         }
//                     },
//                     options: {
//                         lineNumbers: "on",
//                         minimap: { enabled: false },
//                         scrollBeyondLastLine: false,
//                         wordWrap: "on",
//                     },
//                 }}
//             />
//         </Stack>
//     );
// }