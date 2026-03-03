import { useEffect } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import "./App.css";
import { Providers } from "./providers";
import { Router } from "./router";
import { useConfigStore } from "@/store";

function ConfigLoader({ children }: { children: React.ReactNode }) {
  const { config, isLoading, error, fetchConfig } = useConfigStore();

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  if (isLoading || (!config && !error)) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        gap={2}
      >
        <CircularProgress size={40} />
        <Typography variant="body2" color="text.secondary">
          Initializing RMA Engine...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography color="error">Failed to load configuration: {error}</Typography>
      </Box>
    );
  }

  return <>{children}</>;
}

function App() {
  return (
    <Providers>
      <ConfigLoader>
        <Router />
      </ConfigLoader>
    </Providers>
  );
}

export default App;
