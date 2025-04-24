/**
 * @fileoverview This file contains utility functions for downloading and loading JSON files.
 * It provides functions to download a JSON object as a file and to load a JSON file from the user's system.
 * The `downloadJSON` function creates a Blob from the JSON data and triggers a download.
 * The `loadJSON` function creates a file input element, allowing the user to select a JSON file,
 * and reads its content, parsing it into a JavaScript object.
 * The functions handle errors gracefully and log them to the console.
 * @author HoHuiHsieh<billhsies@gmail.com>
 */

/**
 * @description Downloads a JSON object as a file.
 * @param data 
 * @param filename 
 */
export const downloadJSON = (data: object, filename: string): void => {
    try {
        const json = JSON.stringify(data, null, "\t");
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error downloading JSON:", error);
    }
};

/**
 * @description Loads a JSON file from the user's system.
 * @param onLoad 
 */
export const loadJSON = async (onLoad: (data: any) => void): Promise<void> => {
    try {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = async (event: Event) => {
            const target = event.target as HTMLInputElement;
            const file = target.files?.[0];
            if (file) {
                try {
                    const text = await file.text();
                    const json = JSON.parse(text);
                    onLoad(json);
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                }
            }
        };
        input.click();
    } catch (error) {
        console.error("Error loading JSON:", error);
    }
};
