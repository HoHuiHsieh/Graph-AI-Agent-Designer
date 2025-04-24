/**
 * @fileoverview This component represents the CredentialEditor, which is used to edit the credentials for various services.
 * 
 * @author HoHuiHsieh<billhsies@gmail.com>
 */
import React from "react";
import { Stack, TextField, useTheme } from "@mui/material";
import { OpenAICredentialType } from "../../../types/credential";

interface OpenAICredentialEditorProps {
    value: OpenAICredentialType[];
    onChange: (value: OpenAICredentialType[]) => void;
}

/**
 * OpenAICredentialEditor component for editing OpenAI credentials.
 * @param props 
 * @returns 
 */
export default function OpenAICredentialEditor(props: OpenAICredentialEditorProps): React.ReactNode {
    const theme = useTheme();
    const { value, onChange } = props;

    const handleAdd = () => {
        const newValue: OpenAICredentialType[] = [...value, { credName: "OpenAI Credential ", apiKey: "", baseUrl: "https://api.openai.com/v1" }];
        onChange(newValue);
    };
    const handleDelete = (index: number) => {
        const newValue = [...value];
        newValue.splice(index, 1);
        onChange(newValue);
    };

    return (
        <Stack
            direction="column"
            spacing={2}
            sx={{
                maxHeight: "75vh",
                overflowY: "auto",
                justifyContent: "flex-start",
                alignItems: "stretch",
            }}
        >
            {value.map((item, index) => (
                <Stack
                    key={`openai-${index}`}
                    direction="column"
                    spacing={2}
                    sx={{
                        justifyContent: "flex-start",
                        alignItems: "stretch",
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        padding: theme.spacing(2),
                    }}
                >
                    <TextField
                        label="Credential Name"
                        variant="outlined"
                        size="small"
                        value={item.credName}
                        onChange={(e) => {
                            const newValue = [...value];
                            newValue[index].credName = e.target.value;
                            onChange(newValue);
                        }}
                    />
                    <TextField
                        label="ApiKey"
                        variant="outlined"
                        size="small"
                        type="password"
                        value={item.apiKey}
                        onChange={(e) => {
                            const newValue = [...value];
                            newValue[index].apiKey = e.target.value;
                            onChange(newValue);
                        }}
                    />
                    <TextField
                        label="BaseUrl"
                        variant="outlined"
                        size="small"
                        value={item.baseUrl}
                        onChange={(e) => {
                            const newValue = [...value];
                            newValue[index].baseUrl = e.target.value;
                            onChange(newValue);
                        }}
                    />
                    <button onClick={() => handleDelete(index)}>Delete</button>
                </Stack>
            ))}
            <button onClick={handleAdd}>Add</button>
        </Stack>
    );
}
