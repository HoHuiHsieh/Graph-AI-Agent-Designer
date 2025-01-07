/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import * as React from "react";
import { Box } from "@mui/material";
import WorkFlow from "@/components/Workflow";


/**
 * 
 * @returns 
 */
export default function Home() {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%"
            }}
        >
            <title>Graph Agentic AI Designer</title>
            <WorkFlow />
        </Box>
    );
}