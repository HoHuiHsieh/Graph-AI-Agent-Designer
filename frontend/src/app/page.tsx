/**
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import * as React from "react";
import WorkFlow from "@/components/WorkFlow";
import { Box } from "@mui/material";


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
            <title>Graph AI-Agent Designer</title>
            <WorkFlow />
        </Box>
    );
}