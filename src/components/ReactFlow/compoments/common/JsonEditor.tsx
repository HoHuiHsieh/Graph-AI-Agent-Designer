/**
 * @fileoverview
 * A React component for editing JSON key-value pairs.
 * 
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { Stack, TextField, useTheme } from "@mui/material";
import React from "react";

interface JsonEditorProps {
    label: string;
    value: { [key: string]: any };
    onChange: (value: { [key: string]: any }) => void;
}

interface KeyValueItem {
    key: string;
    value: string;
}

/**
 * Input fields for JSON variables.
 * @param props - The props for the JsonEditor component.
 * @returns The rendered JsonEditor component.
 */
export default function JsonEditor({ label, value = {}, onChange }: JsonEditorProps) {
    const theme = useTheme();

    // State to manage the list of key-value pairs and error messages
    const [items, setItems] = React.useState<KeyValueItem[]>(Object.entries(value).map(([key, value]) => ({ key, value })));
    const [error, setError] = React.useState<string | null>(null);   

    /**
     * Handles changes to a specific key-value pair.
     * @param {number} index - The index of the item being changed.
     * @param {string} key - The new key.
     * @param {string} value - The new value.
     */
    const handleChange = (index: number, key: string, value: string) => {
        const newItems = [...items];
        newItems[index] = { key, value };

        // Check for duplicate keys
        const hasDuplicateKey = newItems.some((item, i) => item.key === key && i !== index);
        if (hasDuplicateKey) {
            setError(`Duplicate key: "${key}"`);
            return;
        }

        setError(null);
        setItems(newItems);

        // Notify parent component of the updated JSON object
        onChange(Object.fromEntries(newItems.map(item => [item.key, item.value])));
    };

    /**
     * Adds a new empty key-value pair.
     */
    const handleAdd = () => {
        setItems([...items, { key: "", value: "" }]);
    };

    /**
     * Removes a key-value pair at the specified index.
     * @param {number} index - The index of the item to remove.
     */
    const handleRemove = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);

        // Notify parent component of the updated JSON object
        onChange(Object.fromEntries(newItems.map(item => [item.key, item.value])));
    };

    return (
        <Stack
            direction="column"
            spacing={2}
            sx={{
                maxHeight: "300px",
                overflowY: "auto",
                justifyContent: "flex-start",
                alignItems: "stretch",
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                padding: theme.spacing(2),
            }}
        >
            {/* Label for the editor */}
            <div style={{ fontWeight: "bold", marginBottom: theme.spacing(1) }}>{label}</div>

            {/* Render each key-value pair */}
            {items.map((item, index) => (
                <KeyValueRow
                    key={index}
                    index={index}
                    item={item}
                    onChange={handleChange}
                    onRemove={handleRemove}
                />
            ))}

            {/* Button to add a new key-value pair */}
            <button onClick={handleAdd} aria-label="Add key-value pair">Add</button>

            {/* Display error message if any */}
            {error && <div style={{ color: "red" }}>{error}</div>}
        </Stack>
    );
}

/**
 * A row component for editing a single key-value pair.
 * @param props - The props for the KeyValueRow component.
 * @returns The rendered KeyValueRow component.
 */
function KeyValueRow({ index, item: { key, value }, onChange, onRemove }): React.ReactNode {
    return (
        <Stack
            direction="row"
            spacing={1}
            sx={{
                justifyContent: "flex-start",
                alignItems: "flex-start",
            }}
        >
            {/* Input for the key */}
            <TextField
                variant="outlined"
                label={`Key ${index + 1}`}
                size="small"
                value={key}
                onChange={(e) => onChange(index, e.target.value, value)}
                style={{ minWidth: 120 }}
            />

            {/* Input for the value */}
            <TextField
                variant="outlined"
                fullWidth
                label={`Value ${index + 1}`}
                size="small"
                value={value}
                onChange={(e) => onChange(index, key, e.target.value)}
            />

            {/* Button to remove the key-value pair */}
            <button onClick={() => onRemove(index)} aria-label={`Remove key-value pair ${index + 1}`}>Remove</button>
        </Stack>
    );
}