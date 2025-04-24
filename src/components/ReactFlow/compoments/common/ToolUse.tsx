/**
 * @fileoverview
 * 
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { Paper, Stack, TextField, useTheme } from "@mui/material";
import React, { memo } from "react";

interface ToolUseProps {
    name: string;
    arguments?: { [key: string]: any };
    description: string;
    onChange: (description: string) => void;
}

interface Argument {
    type: string;
    description: string;
}

interface ArgumentListProps {
    args: { [key: string]: Argument };
}

const InstructionList = memo(function InstructionList() {
    return (
        <>
            <p><strong>Tips:</strong></p>
            <p>1. Use the command format <code>{`'{{ $("name", "type", "description") }}'`}</code> in your <strong>configuration</strong> to bind the tool calling from AI.</p>
            <p>2. Ensure the <strong>name</strong> is unique within the same AI agent.</p>
            <p>3. The <strong>type</strong> must be one of the following:</p>
            <ul>
                <li><code>string</code></li>
                <li><code>number</code></li>
                <li><code>boolean</code></li>
                <li><code>bigint</code></li>
                <li><code>date</code></li>
                <li><code>symbol</code></li>
            </ul>
            <p>4. Provide a meaningful <strong>description</strong> for the argument.</p>
        </>
    );
});

const ArgumentList = memo(function ArgumentList({ args }: ArgumentListProps) {
    return (
        <>
            <p><strong>Current Arguments (save to refresh):</strong></p>
            <ul>
                {Object.entries(args).map(([key, value]) => (
                    <li key={key}>
                        <strong>{key}</strong>: <code>{value.type}</code> - {value.description}
                    </li>
                ))}
            </ul>
        </>
    );
});

/**
 * 
 * @param props 
 * @returns 
 */
export default function ToolUse(props: ToolUseProps) {
    const { name, description, onChange, arguments: args = {} } = props;
    const theme = useTheme();
    return (
        <Stack direction="column"
            spacing={2}
            sx={{
                justifyContent: "flex-start",
                alignItems: "stretch",
                overflowY: "auto",
                paddingTop: 1,
            }}
        >
            <TextField
                label="Tool Name (same as Node Name)"
                variant="standard"
                size="small"
                value={name}
                // Fixed incorrect type
                type="text"
                slotProps={{
                    htmlInput: {
                        readOnly: true,
                    },
                }}
            />
            <TextField
                label="Description"
                variant="outlined"
                size="small"
                value={description}
                onChange={(e) => onChange(e.target.value)}
                // Fixed incorrect type
                type="text"
            />
            <Paper elevation={8} sx={{
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.grey[500],
            }} >
                <InstructionList />
                <ArgumentList args={args} />
            </Paper>
        </Stack>
    );

}
