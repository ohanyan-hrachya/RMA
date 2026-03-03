import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Chip from "@mui/material/Chip";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/shared/ui";
import { Logo } from "./Logo";

interface TopbarProps {
    showSidebar: boolean;
    onMenuClick: () => void;
    breadcrumbs: Array<{ label: string; path: string }>;
}

export function Topbar({ showSidebar, onMenuClick, breadcrumbs }: TopbarProps) {
    const navigate = useNavigate();

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                bgcolor: "background.paper",
                borderBottom: "1px solid",
                borderColor: "divider",
                zIndex: (theme) => theme.zIndex.drawer - 1,
            }}
        >
            <Toolbar sx={{ gap: 2, minHeight: 64 }}>
                {showSidebar && (
                    <IconButton
                        edge="start"
                        onClick={onMenuClick}
                        sx={{ display: { sm: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}

                {!showSidebar && <Logo />}

                <Breadcrumbs sx={{ flex: 1 }}>
                    <Link
                        underline="hover"
                        color="text.secondary"
                        sx={{ cursor: "pointer", fontSize: "0.875rem", fontWeight: 500 }}
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
                            fontWeight={i === breadcrumbs.length - 1 ? 700 : 500}
                        >
                            {b.label}
                        </Typography>
                    ))}
                </Breadcrumbs>

                <Stack direction="row" spacing={2} alignItems="center">
                    <Chip
                        label="v1.0"
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 600, px: 0.5 }}
                    />
                    <ThemeToggle />
                </Stack>
            </Toolbar>
        </AppBar>
    );
}
