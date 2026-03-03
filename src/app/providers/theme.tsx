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
          "&:hover": { boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)" },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { borderRadius: "16px 0 0 16px" },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 500 },
      },
    },
  },
};

const lightTheme: PaletteOptions = {
  mode: "light",
  primary: { main: "#10B981", light: "#34D399", dark: "#059669" },
  secondary: { main: "#0F172A" },
  background: { default: "#F1F5F9", paper: "#FFFFFF" },
  text: { primary: "#020617", secondary: "#475569" },
  divider: "#E2E8F0",
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
  divider: "#1E293B",
  success: { main: "#10B981", light: "#064E3B" },
  warning: { main: "#F59E0B", light: "#451A03" },
  error: { main: "#EF4444", light: "#450A0A" },
  info: { main: "#3B82F6", light: "#172554" },
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

  // Keep browser UI in sync (scrollbars, form controls, etc.)
  useEffect(() => {
    document.documentElement.style.colorScheme = mode;
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
