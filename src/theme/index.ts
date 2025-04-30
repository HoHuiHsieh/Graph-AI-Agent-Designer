import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "light", // Switch to "dark" for dark mode
        primary: {
            light: "#63a4ff", // Light shade of primary color
            main: "#1976d2", // Main primary color
            dark: "#004ba0", // Dark shade of primary color
            contrastText: "#ffffff", // Ensure text contrast
        },
        secondary: {
            light: "#a5d6a7", // Light shade of secondary color (light green)
            main: "#66bb6a", // Main secondary color (light green)
            dark: "#338a3e", // Dark shade of secondary color (light green)
            contrastText: "#ffffff", // Ensure text contrast
        },
        background: {
            default: "#f5f5f5", // Light background
            paper: "#ffffff", // Paper background
        },
        text: {
            primary: "#333333", // Primary text color
            secondary: "#666666", // Secondary text color
        },
        grey: {
            50: "#f9f9f9", // Light grey
            100: "#f0f0f0", // Light grey
            200: "#e0e0e0", // Light grey
            300: "#cfcfcf", // Light grey
            400: "#b0b0b0", // Light grey
            500: "#9e9e9e", // Medium grey
            600: "#757575", // Medium grey
            700: "#616161", // Medium grey
            800: "#424242", // Dark grey
            900: "#212121", // Dark grey    
        }
    },
    typography: {
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif", // Customize typography
        h1: {
            fontSize: "2.5rem",
            fontWeight: 700,
        },
        h2: {
            fontSize: "2rem",
            fontWeight: 600,
        },
        h3: {
            fontSize: "1.75rem",
            fontWeight: 500,
        },
        h4: {
            fontSize: "1.5rem",
            fontWeight: 500,
        },
        subtitle1: {
            fontSize: "1.25rem",
            fontWeight: 400,
        },
        subtitle2: {
            fontSize: "1rem",
            fontWeight: 400,
        },
        body1: {
            fontSize: "1rem",
            lineHeight: 1.5,
        },
        caption: {
            fontSize: "0.875rem",
            fontWeight: 300,
            lineHeight: 1.4,
        },
        overline: {
            fontSize: "0.75rem",
            fontWeight: 400,
            textTransform: "uppercase",
            lineHeight: 1.6,
        },
        button: {
            textTransform: "none", // Disable uppercase transformation
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "8px", // Rounded corners for buttons
                    padding: "8px 16px", // Adjust padding
                },
                containedPrimary: {
                    backgroundColor: "#1976d2",
                    "&:hover": {
                        backgroundColor: "#115293", // Darker shade on hover
                    },
                },
            },
        },
    },
});

export default theme;
