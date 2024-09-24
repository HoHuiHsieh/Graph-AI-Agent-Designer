"use client";
/**
 * custom theme 
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";

// use Roboto fonts
const roboto = Roboto({
    weight: ["300", "400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
});

// custom theme 
const theme = createTheme({
    palette: {
        mode: "light",
        common: {
            black: "#1a1a1a",
            white: "#ffffff"
        },
        primary: {
            main: "#3a5f2e", // A deep forest green
            light: "#a6d49f", // A light, soothing green
            dark: "#2e4922", // A deeper shade for contrast
            contrastText: "#ffffff"
        },
        secondary: {
            main: "#8c7b58", // Earthy, warm beige
            light: "#e1d8c2", // Soft beige for lighter touches
            dark: "#5e5039", // A stronger, rich brown for depth
            contrastText: "#ffffff"
        },
        error: {
            main: "#d32f2f", // A strong, attention-grabbing red
            light: "#f7b4b4", // Softened red for warnings or error highlights
            dark: "#8b0000", // Deep red for critical elements
            contrastText: "#ffffff"
        },
        warning: {
            main: "#f57c00", // A bold, vibrant orange
            light: "#ffb74d", // Lighter orange for softer warnings
            dark: "#e65100", // Darker for more impactful warnings
            contrastText: "#ffffff"
        },
        info: {
            main: "#0288d1", // Crisp, clean blue for information
            light: "#81d4fa", // Lighter blue for highlights
            dark: "#01579b", // Darker blue for emphasis
            contrastText: "#ffffff"
        },
        success: {
            main: "#388e3c", // Bold green for success actions
            light: "#a5d6a7", // Softer green for messages
            dark: "#1b5e20", // Deep green for confirmation
            contrastText: "#ffffff"
        },
        background: {
            default: "#f0f4f3", // A light, cool background to keep it airy
            paper: "#d9e2db" // Subtle shade for cards or paper elements
        }
    },
    typography: {
        fontFamily: roboto.style.fontFamily,
        caption: {
            fontSize: 14,
            fontWeight: 400,
            lineHeight: 1.66
        },
        h1: {
            fontWeight: 700,
            fontSize: 32,
            lineHeight: 1.375
        },
        h2: {
            fontWeight: 700,
            fontSize: 28,
            lineHeight: 1.375
        },
        h3: {
            fontWeight: 700,
            fontSize: 24,
            lineHeight: 1.375
        },
        h4: {
            fontWeight: 600,
            fontSize: 20,
            lineHeight: 1.375
        },
        h5: {
            fontWeight: 500,
            fontSize: 16,
            lineHeight: 1.375
        },
        h6: {
            fontWeight: 500,
            fontSize: 14,
            lineHeight: 1.375
        },
        button: {
            fontWeight: 600,
            fontSize: 18,
            lineHeight: 1.375
        },
    },
    components: {
        MuiTextField: {
            defaultProps: {
                InputProps: {
                    style: {
                        backgroundColor: "#FFFFFF"
                    },
                },
            },
        }
    },
    shape: {
        borderRadius: 8
    },
});

export default theme;