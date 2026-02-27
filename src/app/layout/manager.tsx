import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/DashboardOutlined";
import PeopleIcon from "@mui/icons-material/PeopleOutline";
import WorkIcon from "@mui/icons-material/WorkOutline";
import AccountBalanceIcon from "@mui/icons-material/AccountBalanceOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { AnimatePresence } from "framer-motion";
import { useAuthStore, useUIStore } from "../../store";

const DRAWER_WIDTH = 260;
const COLLAPSED_WIDTH = 72;

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  permission?: string;
}

const navItems: NavItem[] = [
  {
    label: "Overview",
    path: "/",
    icon: <DashboardIcon />,
    permission: "overview:view",
  },
  {
    label: "Users",
    path: "/users",
    icon: <PeopleIcon />,
    permission: "users:list",
  },
  { label: "Jobs", path: "/jobs", icon: <WorkIcon />, permission: "jobs:list" },
  {
    label: "Banking",
    path: "/banking",
    icon: <AccountBalanceIcon />,
    permission: "banking:list",
  },
];

export function Manager() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarCollapsed, toggleCollapsed } = useUIStore();
  const user = useAuthStore((s) => s.user);
  const permissions = useAuthStore((s) => s.permissions);
  const [mobileOpen, setMobileOpen] = useState(false);

  const drawerWidth = sidebarCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;

  const breadcrumbs = location.pathname
    .split("/")
    .filter(Boolean)
    .map((segment, i, arr) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      path: "/" + arr.slice(0, i + 1).join("/"),
    }));

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: sidebarCollapsed ? "center" : "space-between",
        }}
      >
        {!sidebarCollapsed && (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 800,
                fontSize: 14,
              }}
            >
              R
            </Box>
            <Typography
              variant="subtitle1"
              fontWeight={800}
              letterSpacing="-0.02em"
            >
              RMA Manager
            </Typography>
          </Stack>
        )}
        <IconButton
          size="small"
          onClick={toggleCollapsed}
          sx={{ display: { xs: "none", sm: "flex" } }}
        >
          <ChevronLeftIcon
            sx={{
              transform: sidebarCollapsed ? "rotate(180deg)" : "none",
              transition: "transform 0.2s",
            }}
          />
        </IconButton>
      </Box>
      <Divider />
      <List sx={{ flex: 1, px: 1, pt: 1 }}>
        {navItems
          .filter(
            (item) => !item.permission || permissions.has(item.permission),
          )
          .map((item) => {
            const active =
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path);
            return (
              <ListItemButton
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                selected={active}
                sx={{
                  borderRadius: 2.5,
                  mb: 0.5,
                  px: sidebarCollapsed ? 1.5 : 2,
                  justifyContent: sidebarCollapsed ? "center" : "flex-start",
                  "&.Mui-selected": {
                    bgcolor: "primary.main",
                    color: "#fff",
                    "&:hover": { bgcolor: "primary.dark" },
                    "& .MuiListItemIcon-root": { color: "#fff" },
                  },
                  "&:hover": {
                    bgcolor: active ? "primary.dark" : "action.hover",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: sidebarCollapsed ? 0 : 40,
                    color: active ? "#fff" : "text.secondary",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!sidebarCollapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: "0.875rem",
                      fontWeight: active ? 600 : 500,
                    }}
                  />
                )}
              </ListItemButton>
            );
          })}
      </List>
      <Divider />
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: "primary.main",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          {user?.name?.charAt(0) ?? "U"}
        </Avatar>
        {!sidebarCollapsed && (
          <Box sx={{ overflow: "hidden" }}>
            <Typography variant="body2" fontWeight={600} noWrap>
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
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            borderRight: "1px solid",
            borderColor: "divider",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            transition: "width 0.2s ease",
            borderRight: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          ml: { sm: `${drawerWidth}px` },
          transition: "margin-left 0.2s ease",
        }}
      >
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: "background.paper",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Toolbar sx={{ gap: 2 }}>
            <IconButton
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Breadcrumbs sx={{ flex: 1 }}>
              <Link
                underline="hover"
                color="text.secondary"
                sx={{ cursor: "pointer", fontSize: "0.875rem" }}
                onClick={() => navigate("/")}
              >
                Home
              </Link>
              {breadcrumbs.map((b, i) => (
                <Typography
                  key={b.path}
                  variant="body2"
                  color={
                    i === breadcrumbs.length - 1
                      ? "text.primary"
                      : "text.secondary"
                  }
                  fontWeight={i === breadcrumbs.length - 1 ? 600 : 400}
                >
                  {b.label}
                </Typography>
              ))}
            </Breadcrumbs>
            <Chip label="v1.0" size="small" variant="outlined" />
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flex: 1, p: { xs: 2, sm: 3 } }}>
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
}
