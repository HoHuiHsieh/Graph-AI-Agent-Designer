/**
 * @fileoverview This component represents the CredentialEditor, which is used to edit the credentials for various services.
 * 
 * @author HoHuiHsieh<billhsies@gmail.com>
 */
import React from "react";
import { Stack, TextField, useTheme } from "@mui/material";
import { PostgreSQLCredentialType } from "../../../types/credential";


interface PostgreSQLCredentialEditorProps {
    value: PostgreSQLCredentialType[];
    onChange: (value: PostgreSQLCredentialType[]) => void;
}

/**
 * PostgreSQLCredentialEditor component for editing PostgreSQL credentials.
 * @param props 
 * @returns 
 */
export default function PostgreSQLCredentialEditor(props: PostgreSQLCredentialEditorProps): React.ReactNode {
    const theme = useTheme();
    const { value, onChange } = props;

    const handleAdd = () => {
        const newValue: PostgreSQLCredentialType[] = [...value, { 
            credName: "PostgreSQL Credential", 
            host: "postgresql", 
            port: 5432, 
            database: "postgresql", 
            user: "root", 
            password: "" 
        }];
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
                    key={`postgresql-${index}`}
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
                        label="Host"
                        variant="outlined"
                        size="small"
                        value={item.host}
                        onChange={(e) => {
                            const newValue = [...value];
                            newValue[index].host = e.target.value;
                            onChange(newValue);
                        }}
                    />
                    <TextField
                        label="Port"
                        variant="outlined"
                        size="small"
                        type="number"
                        value={item.port}
                        onChange={(e) => {
                            const newValue = [...value];
                            newValue[index].port = Number(e.target.value);
                            onChange(newValue);
                        }}
                    />
                    <TextField
                        label="Database"
                        variant="outlined"
                        size="small"
                        value={item.database}
                        onChange={(e) => {
                            const newValue = [...value];
                            newValue[index].database = e.target.value;
                            onChange(newValue);
                        }}
                    />
                    <TextField
                        label="Username"
                        variant="outlined"
                        size="small"
                        value={item.user}
                        onChange={(e) => {
                            const newValue = [...value];
                            newValue[index].user = e.target.value;
                            onChange(newValue);
                        }}
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        size="small"
                        type="password"
                        value={item.password}
                        onChange={(e) => {
                            const newValue = [...value];
                            newValue[index].password = e.target.value;
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
