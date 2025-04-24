/**
 * @fileoverview
 * The ModelEditor component provides a user interface for configuring and editing
 * various parameters related to AI models. It includes functionality for selecting
 * credentials, choosing models, and adjusting parameters such as temperature, 
 * top_p, frequency_penalty, and presence_penalty. The component uses direct props
 * to manage state and supports both simplified and advanced parameter configurations.
 * 
 * Features:
 * - Credential selection with dynamic model list fetching.
 * - Parameter adjustment with validation and range sliders.
 * - Simplified mode to hide advanced parameter selection.
 * 
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React from "react";
import { FormControl, InputLabel, MenuItem, Select, Stack, Switch, TextField } from "@mui/material";
import { usePanel } from "../../../provider";
import { fetchModelList } from "../utils";


// Initial values for reference
export const initialValues = {
    credName: "",
    model: "",
    max_completion_tokens: 1024,
    frequency_penalty: 0,
    presence_penalty: 0,
    parallel_tool_calls: false,
    top_p: 0.9,
    temperature: 0.9,
};

interface ModelEditorProps {
    credName: string;
    setCredName: (credName: string) => void;
    model: string;
    setModel: (model: string) => void;
    max_completion_tokens?: number;
    setMaxCompletionTokens?: (max_completion_tokens: number) => void;
    frequency_penalty?: number;
    setFrequencyPenalty?: (frequency_penalty: number) => void;
    presence_penalty?: number;
    setPresencePenalty?: (presence_penalty: number) => void;
    parallel_tool_calls?: boolean;
    setParallelToolCalls?: (parallel_tool_calls: boolean) => void;
    top_p?: number;
    setTopP?: (top_p: number) => void;
    temperature?: number;
    setTemperature?: (temperature: number) => void;
    simplify?: boolean;
}

/**
 * ModelEditor component
 * @param props 
 * @returns 
 */
export function ModelEditor(props: ModelEditorProps): React.ReactNode {
    const { credentials } = usePanel();
    const { simplify = true } = props;

    // Update model list
    const [modelList, setModelList] = React.useState<string[]>([]);
    React.useEffect(() => {
        if (!props.credName) return;
        const func = async () => {
            const selectedCredential = credentials.openai.find(
                (cred) => cred.credName === props.credName
            );
            if (!selectedCredential) return;
            const { apiKey, baseUrl } = selectedCredential;
            try {
                const result = await fetchModelList(apiKey, baseUrl);
                setModelList((prev) => {
                    if (Array.isArray(result)) {
                        return result;
                    } else {
                        return [];
                    }
                })
            } catch (error) {
                console.error("Error fetching model list:", error);
            }
        };
        func();
    }, [props.credName, credentials.openai]);

    // Handle changes in parameter list
    const [paramList, setparamList] = React.useState<string[]>([]);
    React.useEffect(() => {
        if (!paramList.includes("max_completion_tokens") && props.setMaxCompletionTokens) {
            props.setMaxCompletionTokens(initialValues.max_completion_tokens);
        }
        if (!paramList.includes("temperature") && props.setTemperature) {
            props.setTemperature(initialValues.temperature);
        }
        if (!paramList.includes("top_p") && props.setTopP) {
            props.setTopP(initialValues.top_p);
        }
        if (!paramList.includes("frequency_penalty") && props.setFrequencyPenalty) {
            props.setFrequencyPenalty(initialValues.frequency_penalty);
        }
        if (!paramList.includes("presence_penalty") && props.setPresencePenalty) {
            props.setPresencePenalty(initialValues.presence_penalty);
        }
        if (!paramList.includes("parallel_tool_calls") && props.setParallelToolCalls) {
            props.setParallelToolCalls(initialValues.parallel_tool_calls);
        }
    }, [paramList]);

    return (
        <Stack
            direction="column"
            spacing={2}
            sx={{
                justifyContent: "flex-start",
                alignItems: "stretch",
                overflowY: "auto",
                paddingTop: 1,
            }}
        >
            <FormControl sx={{ marginTop: 4, minWidth: 120 }}>
                <InputLabel shrink htmlFor="select-credential">
                    Credential
                </InputLabel>
                <Select
                    labelId="select-credential"
                    variant="outlined"
                    size="small"
                    value={props.credName || "None"}
                    onChange={(e) => {
                        const selectedCredential = credentials.openai.find(
                            (cred) => cred.credName === e.target.value
                        );
                        if (selectedCredential) {
                            props.setCredName(selectedCredential.credName);
                        } else {
                            props.setCredName("");
                        }
                    }}
                    style={{ minWidth: 120 }}
                    MenuProps={{
                        PaperProps: {
                            style: {
                                zIndex: 1002,
                            },
                        },
                    }}
                >
                    <MenuItem value="None">
                        <em>None</em>
                    </MenuItem>
                    {credentials.openai.map((cred) => (
                        <MenuItem key={cred.credName} value={cred.credName}>
                            {cred.credName}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl sx={{ marginTop: 4, minWidth: 120 }}>
                <InputLabel shrink htmlFor="select-model">
                    Model
                </InputLabel>
                <Select
                    labelId="select-model"
                    variant="outlined"
                    size="small"
                    value={props.model || "None"}
                    onChange={(event) => {
                        if (event.target.value === "None") {
                            props.setModel("");
                        } else {
                            props.setModel(`${event.target.value}`);
                        }
                    }}
                    style={{ minWidth: 120 }}
                    MenuProps={{
                        PaperProps: {
                            style: {
                                zIndex: 1002,
                            },
                        },
                    }}
                >
                    <MenuItem value="None">
                        <em>None</em>
                    </MenuItem>
                    {modelList.map((e) => (
                        <MenuItem key={e} value={e}>
                            {e}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {paramList.map((key, index) => {
                switch (key) {
                    case "max_completion_tokens":
                        return (
                            <TextField key={index}
                                label="Max Completion Tokens"
                                variant="outlined"
                                size="small"
                                type="number"
                                fullWidth
                                value={props.max_completion_tokens}
                                onChange={(e) => {
                                    const value = Math.min(4096, Math.max(1, Number(e.target.value)));
                                    props.setMaxCompletionTokens(value);
                                }}
                            />
                        );
                    case "temperature":
                        return (
                            <TextField key={index}
                                label="Temperature"
                                variant="outlined"
                                size="small"
                                type="number"
                                fullWidth
                                value={props.temperature}
                                onChange={(e) => {
                                    const value = Math.min(1, Math.max(0, Number(e.target.value)));
                                    props.setTemperature(value);
                                }}
                                slotProps={{
                                    htmlInput: {
                                        min: 0,
                                        max: 1,
                                        step: 0.01,
                                        style: { textAlign: "center" },
                                    },
                                    input: {
                                        startAdornment: (
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.01"
                                                value={props.temperature}
                                                onChange={(e) => props.setTemperature(Number(e.target.value))}
                                                style={{ width: "100%" }}
                                            />
                                        ),
                                    },
                                }}
                            />
                        )
                    case "top_p":
                        return (
                            <TextField key={index}
                                label="Top P"
                                variant="outlined"
                                size="small"
                                type="number"
                                fullWidth
                                value={props.top_p}
                                onChange={(e) => {
                                    const value = Math.min(1, Math.max(0, Number(e.target.value)));
                                    props.setTopP(value);
                                }}
                                slotProps={{
                                    htmlInput: {
                                        min: 0,
                                        max: 1,
                                        step: 0.01,
                                        style: { textAlign: "center" },
                                    },
                                    input: {
                                        startAdornment: (
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.01"
                                                value={props.top_p}
                                                onChange={(e) => props.setTopP(Number(e.target.value))}
                                                style={{ width: "100%" }}
                                            />
                                        ),
                                    },
                                }}
                            />
                        )
                    case "frequency_penalty":
                        return (
                            <TextField key={index}
                                label="Frequency Penalty"
                                variant="outlined"
                                size="small"
                                type="number"
                                fullWidth
                                value={props.frequency_penalty}
                                onChange={(e) => {
                                    const value = Math.min(2, Math.max(-2, Number(e.target.value)));
                                    props.setFrequencyPenalty(value);
                                }}
                                slotProps={{
                                    htmlInput: {
                                        min: -2,
                                        max: 2,
                                        step: 0.01,
                                        style: { textAlign: "center" },
                                    },
                                    input: {
                                        startAdornment: (
                                            <input
                                                type="range"
                                                min="-2"
                                                max="2"
                                                step="0.01"
                                                value={props.frequency_penalty}
                                                onChange={(e) => props.setFrequencyPenalty(Number(e.target.value))}
                                                style={{ width: "100%" }}
                                            />
                                        ),
                                    },
                                }}
                            />

                        )
                    case "presence_penalty":
                        return (
                            <TextField key={index}
                                label="Presence Penalty"
                                variant="outlined"
                                size="small"
                                type="number"
                                fullWidth
                                value={props.presence_penalty}
                                onChange={(e) => {
                                    const value = Math.min(2, Math.max(-2, Number(e.target.value)));
                                    props.setPresencePenalty(value);
                                }}
                                slotProps={{
                                    htmlInput: {
                                        min: -2,
                                        max: 2,
                                        step: 0.01,
                                        style: { textAlign: "center" },
                                    },
                                    input: {
                                        startAdornment: (
                                            <input
                                                type="range"
                                                min="-2"
                                                max="2"
                                                step="0.01"
                                                value={props.presence_penalty}
                                                onChange={(e) => props.setPresencePenalty(Number(e.target.value))}
                                                style={{ width: "100%" }}
                                            />
                                        ),
                                    },
                                }}
                            />
                        )
                    case "parallel_tool_calls":
                        return (
                            <Stack direction="row" alignItems="center" spacing={1} key={index} >
                                <label>Parallel Tool Calls</label>
                                <Switch
                                    checked={props.parallel_tool_calls}
                                    onChange={(e) => props.setParallelToolCalls(e.target.checked)}
                                />
                            </Stack>
                        )

                    default:
                        break;
                }
            })}

            {/* Select many parameters to add into the paramList */}
            {!simplify &&
                <FormControl sx={{ marginTop: 4, minWidth: 120 }}>
                    <InputLabel shrink htmlFor="select-multiple-parameters">
                        Parameters
                    </InputLabel>
                    <Select multiple
                        labelId="select-multiple-parameters"
                        variant="standard"
                        size="small"
                        fullWidth
                        value={paramList}
                        onChange={(e) => setparamList(e.target.value as string[])}
                        renderValue={(selected) => selected.join(", ")}
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    zIndex: 1002,
                                },
                            },
                        }}
                    >
                        <MenuItem value="max_completion_tokens">Max Completion Tokens</MenuItem>
                        <MenuItem value="temperature">Temperature</MenuItem>
                        <MenuItem value="top_p">Top P</MenuItem>
                        <MenuItem value="frequency_penalty">Frequency Penalty</MenuItem>
                        <MenuItem value="presence_penalty">Presence Penalty</MenuItem>
                        <MenuItem value="parallel_tool_calls">Parallel Tool Calls</MenuItem>
                    </Select>
                </FormControl>
            }
        </Stack>
    );
}

