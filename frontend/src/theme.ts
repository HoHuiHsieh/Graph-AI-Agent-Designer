"use client";
import { createTheme } from "@mui/material/styles";


const theme = createTheme({
    palette: {
        mode: "light",
        common: {
            black: "#102000",
            white: "#ffffff"
        },
        primary: {
            main: "#4c662b",
            light: "#cdeda3",
            dark: "#102000",
            contrastText: "#ffffff"
        },
        secondary: {
            main: "#586249",
            light: "#dce7c8",
            dark: "#151e0b",
            contrastText: "#ffffff"
        },
        error: {
            main: "#ba1a1a",
            light: "#ffdad6",
            dark: "#410002",
            contrastText: "#ffffff"
        },
        warning: {
            main: "#ed6c02",
            light: "#ff9800",
            dark: "#e65100",
            contrastText: "#ffffff"
        },
        info: {
            main: "#386663",
            light: "#bcece7",
            dark: "#00201e",
            contrastText: "#ffffff"
        },
        success: {
            main: "#b1d18a",
            light: "#cdeda3",
            dark: "#1f3701",
            contrastText: "#ffffff"
        },
        background: {
            default: "#f9faef",
            paper: "#dadbd0",
        },
    },
    typography: {
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