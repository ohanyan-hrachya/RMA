import {
  createTheme,
  type ThemeOptions,
  responsiveFontSizes,
  type PaletteOptions,
} from "@mui/material/styles";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { useEffect, useMemo, type PropsWithChildren } from "react";
import { useUIStore } from "@/store/ui.store";
import type { ColorMode } from "@/shared/types";

const baseOptions: ThemeOptions = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700, letterSpacing: "-0.02em" },
    h5: { fontWeight: 700, letterSpacing: "-0.01em" },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "8px 20px",
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        },
        containedPrimary: {
          color: "#F1F5F9",
          "&:hover": {
            boxShadow: "0 4px 14px rgba(16, 185, 129, 0.4)",
            backgroundColor: "#059669"
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { border: "none" },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { opacity: 0.1 }
      }
    }
  },
};

const lightTheme: PaletteOptions = {
  mode: "light",
  primary: { main: "#10B981", light: "#34D399", dark: "#059669" },
  secondary: { main: "#0F172A" },
  background: { default: "#F1F5F9", paper: "#FFFFFF" },
  text: { primary: "#020617", secondary: "#475569" },
  divider: "rgba(0,0,0,0.08)",
  success: { main: "#10B981", light: "#D1FAE5" },
  warning: { main: "#F59E0B", light: "#FEF3C7" },
  error: { main: "#EF4444", light: "#FEE2E2" },
  info: { main: "#06B6D4", light: "#CFFAFE" },
};

const darkTheme: PaletteOptions = {
  mode: "dark",
  primary: { main: "#10B981", light: "#34D399", dark: "#059669" },
  secondary: { main: "#F1F5F9" },
  background: { default: "#020617", paper: "#0F172A" },
  text: { primary: "#F1F5F9", secondary: "#94A3B8" },
  divider: "rgba(255,255,255,0.08)",
  success: { main: "#10B981", light: "rgba(16, 185, 129, 0.15)" },
  warning: { main: "#F59E0B", light: "rgba(245, 158, 11, 0.15)" },
  error: { main: "#EF4444", light: "rgba(239, 68, 68, 0.15)" },
  info: { main: "#06B6D4", light: "rgba(6, 182, 212, 0.15)" },
};

function buildTheme(mode: ColorMode) {
  const theme = createTheme({
    ...baseOptions,
    palette: mode === "light" ? lightTheme : darkTheme,
  });

  return responsiveFontSizes(theme);
}

export const Theme = ({ children }: PropsWithChildren) => {
  const mode = useUIStore((s) => s.mode);

  const theme = useMemo(() => buildTheme(mode), [mode]);

  useEffect(() => {
    document.documentElement.style.colorScheme = mode;
    document.body.style.backgroundColor = mode === 'dark' ? '#020617' : '#F1F5F9';
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
