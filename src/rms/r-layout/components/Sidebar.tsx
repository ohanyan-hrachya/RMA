import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import DashboardIcon from "@mui/icons-material/DashboardOutlined";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore, useConfigStore } from "@/store";
import { Logo } from "./Logo";

const ICON_MAP: Record<string, React.ReactNode> = {
    users: <PeopleOutlineIcon />,
    jobs: <WorkOutlineIcon />,
    banking: <AccountBalanceOutlinedIcon />,
    overview: <DashboardIcon />,
};

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
    mobileOpen: boolean;
    onMobileClose: () => void;
    drawerWidth: number;
    collapsible?: boolean;
}

export function Sidebar({
    collapsed,
    onToggle,
    mobileOpen,
    onMobileClose,
    drawerWidth,
    collapsible = true,
}: SidebarProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { config } = useConfigStore();
    const user = useAuthStore((s) => s.user);
    const permissions = useAuthStore((s) => s.permissions);

    const content = (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Box
                sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: collapsed ? "center" : "space-between",
                    minHeight: 64,
                }}
            >
                <Logo collapsed={collapsed} />
                {!collapsed && collapsible && (
                    <IconButton size="small" onClick={onToggle}>
                        <ChevronLeftIcon />
                    </IconButton>
                )}
                {collapsed && collapsible && (
                    <IconButton size="small" onClick={onToggle} sx={{ position: 'absolute', right: -12, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', '&:hover': { bgcolor: 'background.paper' } }}>
                        <ChevronLeftIcon sx={{ transform: 'rotate(180deg)' }} />
                    </IconButton>
                )}
            </Box>
            <Divider />
            <List sx={{ flex: 1, px: 1.5, pt: 2 }}>
                {(config?.modules || [])
                    .filter((item) => !item.permission || permissions.has(item.permission))
                    .map((item) => {
                        const active =
                            item.path === "/"
                                ? location.pathname === "/"
                                : location.pathname.startsWith(item.path);
                        const icon = ICON_MAP[item.id] || <DashboardIcon />;
                        return (
                            <ListItemButton
                                key={item.path}
                                onClick={() => {
                                    navigate(item.path);
                                    onMobileClose();
                                }}
                                selected={active}
                                sx={{
                                    borderRadius: 3,
                                    mb: 0.5,
                                    px: collapsed ? 1.5 : 2,
                                    justifyContent: collapsed ? "center" : "flex-start",
                                    transition: 'all 0.2s',
                                    "&.Mui-selected": {
                                        bgcolor: "primary.main",
                                        color: "#F1F5F9",
                                        boxShadow: (theme) => `0 4px 12px ${theme.palette.primary.main}40`,
                                        "&:hover": { bgcolor: "primary.dark" },
                                        "& .MuiListItemIcon-root": { color: "#F1F5F9" },
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: collapsed ? 0 : 36,
                                        color: active ? "#F1F5F9" : "text.secondary",
                                    }}
                                >
                                    {icon}
                                </ListItemIcon>
                                {!collapsed && (
                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{
                                            fontSize: "0.875rem",
                                            fontWeight: active ? 700 : 500,
                                        }}
                                    />
                                )}
                            </ListItemButton>
                        );
                    })}
            </List>
            <Divider />
            <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                    sx={{
                        width: 36,
                        height: 36,
                        bgcolor: "primary.main",
                        fontWeight: 700,
                        fontSize: 14,
                    }}
                >
                    {user?.name?.charAt(0) ?? "U"}
                </Avatar>
                {!collapsed && (
                    <Box sx={{ overflow: "hidden" }}>
                        <Typography variant="body2" fontWeight={700} noWrap>
                            {user?.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                            {user?.role}
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );

    return (
        <>
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onMobileClose}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: "block", sm: "none" },
                    "& .MuiDrawer-paper": {
                        width: 260,
                        borderRight: "none",
                        boxShadow: 8,
                    },
                }}
            >
                {content}
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: "none", sm: "block" },
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        transition: "width 0.2s ease",
                        borderRight: "1px solid",
                        borderColor: "divider",
                        overflow: "visible",
                    },
                }}
                open
            >
                {content}
            </Drawer>
        </>
    );
}
