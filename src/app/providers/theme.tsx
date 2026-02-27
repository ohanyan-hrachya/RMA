import {
  createTheme,
  type ThemeOptions,
  responsiveFontSizes,
  type PaletteOptions,
} from "@mui/material/styles";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { useEffect, useMemo, type PropsWithChildren } from "react";
import { useUIStore } from "../../store/ui.store";

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
          "&:hover": { boxShadow: "0 4px 14px rgba(37, 99, 235, 0.3)" },
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
  primary: { main: "#2563EB", light: "#60A5FA", dark: "#1D4ED8" },
  secondary: { main: "#7C3AED" },
  background: { default: "#F8FAFC", paper: "#FFFFFF" },
  text: { primary: "#0F172A", secondary: "#64748B" },
  divider: "#E2E8F0",
  success: { main: "#059669", light: "#D1FAE5" },
  warning: { main: "#D97706", light: "#FEF3C7" },
  error: { main: "#DC2626", light: "#FEE2E2" },
  info: { main: "#2563EB", light: "#DBEAFE" },
};

const darkTheme: PaletteOptions = {
  mode: "dark",
  primary: { main: "#2563EB", light: "#60A5FA", dark: "#1D4ED8" },
  secondary: { main: "#7C3AED" },
  background: { default: "#0F172A", paper: "#1E293B" },
  text: { primary: "#F8FAFC", secondary: "#94A3B8" },
  divider: "#334155",
  success: { main: "#059669", light: "#D1FAE5" },
  warning: { main: "#D97706", light: "#FEF3C7" },
  error: { main: "#DC2626", light: "#FEE2E2" },
  info: { main: "#2563EB", light: "#DBEAFE" },
};

export type ColorMode = "light" | "dark";

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
