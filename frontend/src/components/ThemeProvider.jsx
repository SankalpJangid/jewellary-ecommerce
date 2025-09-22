"use client";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { 
      main: "#1a1a1a",
      light: "#333333",
      dark: "#000000"
    },
    secondary: { 
      main: "#d4af37",
      light: "#f4e4a6",
      dark: "#b8941f"
    },
    background: {
      default: "#fafafa",
      paper: "#ffffff"
    },
    text: {
      primary: "#1a1a1a",
      secondary: "#666666"
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "3.5rem",
      lineHeight: 1.2,
      letterSpacing: "-0.02em"
    },
    h2: {
      fontWeight: 600,
      fontSize: "2.5rem",
      lineHeight: 1.3,
      letterSpacing: "-0.01em"
    },
    h3: {
      fontWeight: 600,
      fontSize: "2rem",
      lineHeight: 1.3
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.4
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.4
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
      lineHeight: 1.5
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5
    }
  },
  shape: { borderRadius: 8 },
  shadows: [
    "none",
    "0px 1px 3px rgba(0, 0, 0, 0.05)",
    "0px 2px 6px rgba(0, 0, 0, 0.05)",
    "0px 4px 12px rgba(0, 0, 0, 0.08)",
    "0px 8px 24px rgba(0, 0, 0, 0.12)",
    "0px 16px 48px rgba(0, 0, 0, 0.16)",
    "0px 24px 64px rgba(0, 0, 0, 0.20)",
    "0px 32px 80px rgba(0, 0, 0, 0.24)",
    "0px 40px 96px rgba(0, 0, 0, 0.28)",
    "0px 48px 112px rgba(0, 0, 0, 0.32)",
    "0px 56px 128px rgba(0, 0, 0, 0.36)",
    "0px 64px 144px rgba(0, 0, 0, 0.40)",
    "0px 72px 160px rgba(0, 0, 0, 0.44)",
    "0px 80px 176px rgba(0, 0, 0, 0.48)",
    "0px 88px 192px rgba(0, 0, 0, 0.52)",
    "0px 96px 208px rgba(0, 0, 0, 0.56)",
    "0px 104px 224px rgba(0, 0, 0, 0.60)",
    "0px 112px 240px rgba(0, 0, 0, 0.64)",
    "0px 120px 256px rgba(0, 0, 0, 0.68)",
    "0px 128px 272px rgba(0, 0, 0, 0.72)",
    "0px 136px 288px rgba(0, 0, 0, 0.76)",
    "0px 144px 304px rgba(0, 0, 0, 0.80)",
    "0px 152px 320px rgba(0, 0, 0, 0.84)",
    "0px 160px 336px rgba(0, 0, 0, 0.88)",
    "0px 168px 352px rgba(0, 0, 0, 0.92)"
  ]
});

export default function ThemeProvider({ children }) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
