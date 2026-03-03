import { Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useConfigStore } from "@/store";
import { ModuleEngine } from "@/rms/r-module/ModuleEngine";
import { LayoutEngine } from "@/rms/r-layout";

const PageLoader = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
    <CircularProgress />
  </Box>
);

export const Router = () => {
  const { config } = useConfigStore();

  return (
    <Routes>
      <Route element={<LayoutEngine />}>
        {(config?.modules || []).map((module) => (
          <Route
            key={module.id}
            path={module.path}
            element={
              <Suspense fallback={<PageLoader />}>
                <ModuleEngine moduleId={module.id} />
              </Suspense>
            }
          />
        ))}
        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
