import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useUIStore, useConfigStore } from "@/store";

export function useLayout() {
    const location = useLocation();
    const { sidebarCollapsed, toggleCollapsed } = useUIStore();
    const { config } = useConfigStore();
    const [mobileOpen, setMobileOpen] = useState(false);

    // Derive current module and shell config
    const currentModule = useMemo(() =>
        config?.modules.find(m =>
            m.path === "/" ? location.pathname === "/" : location.pathname.startsWith(m.path)
        ),
        [config?.modules, location.pathname]);

    const shell = useMemo(() =>
        (currentModule && config?.shells[currentModule.shellId]) || config?.shells["default"],
        [currentModule, config?.shells]);

    const showSidebar = shell?.showSidebar ?? true;
    const showTopbar = shell?.showTopbar ?? true;

    const breadcrumbs = useMemo(() =>
        location.pathname
            .split("/")
            .filter(Boolean)
            .map((segment, i, arr) => ({
                label: segment.charAt(0).toUpperCase() + segment.slice(1),
                path: "/" + arr.slice(0, i + 1).join("/"),
            })),
        [location.pathname]);

    return {
        sidebar: {
            collapsed: sidebarCollapsed,
            toggle: toggleCollapsed,
            width: sidebarCollapsed ? 72 : 260,
            mobileOpen,
            setMobileOpen,
        },
        shell: {
            config: shell,
            showSidebar,
            showTopbar,
        },
        currentModule,
        breadcrumbs,
        location,
    };
}
