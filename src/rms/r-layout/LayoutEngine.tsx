import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { useLayout } from "./hooks/useLayout";

export function LayoutEngine() {
    const { sidebar, shell, breadcrumbs } = useLayout();

    return (
        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
                bgcolor: "background.default",
            }}
        >
            {shell.showSidebar && (
                <Sidebar
                    collapsed={sidebar.collapsed}
                    onToggle={sidebar.toggle}
                    mobileOpen={sidebar.mobileOpen}
                    onMobileClose={() => sidebar.setMobileOpen(false)}
                    drawerWidth={sidebar.width}
                    collapsible={shell.config?.sidebarCollapsible}
                />
            )}

            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    ml: { sm: shell.showSidebar ? `${sidebar.width}px` : 0 },
                    transition: "margin-left 0.2s ease",
                }}
            >
                {shell.showTopbar && (
                    <Topbar
                        showSidebar={shell.showSidebar}
                        onMenuClick={() => sidebar.setMobileOpen(true)}
                        breadcrumbs={breadcrumbs}
                    />
                )}

                <Box component="main" sx={{ flex: 1, p: { xs: 2, sm: 4 } }}>
                    <AnimatePresence mode="wait">
                        <Outlet />
                    </AnimatePresence>
                </Box>
            </Box>
        </Box>
    );
}
