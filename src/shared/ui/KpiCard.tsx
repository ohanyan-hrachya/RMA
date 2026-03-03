import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import DashboardIcon from "@mui/icons-material/DashboardOutlined";

const ICON_MAP: Record<string, React.ReactNode> = {
    users: <PeopleOutlineIcon />,
    jobs: <WorkOutlineIcon />,
    banking: <AccountBalanceOutlinedIcon />,
    overview: <DashboardIcon />,
};

interface KpiCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    resource?: string;
    change?: number;
    delay?: number;
}

export function KpiCard({ title, value, subtitle, resource, change, delay = 0 }: KpiCardProps) {
    const icon = resource ? ICON_MAP[resource] : <DashboardIcon />;

    // Standardize all icon backgrounds to Emerald/Success palette to avoid "crushed" colors
    const iconBg = "success.light";
    const iconColor = "success.main";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.3 }}
            style={{ height: "100%" }}
        >
            <Card sx={{ height: "100%", bgcolor: 'background.paper' }}>
                <CardContent>
                    <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                        <Box>
                            <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                {title}
                            </Typography>
                            <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5, mb: 0.5 }}>
                                {value}
                            </Typography>
                            {subtitle && (
                                <Typography variant="caption" color="text.secondary">
                                    {subtitle}
                                </Typography>
                            )}
                            {change !== undefined && (
                                <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
                                    {change >= 0 ? (
                                        <TrendingUpIcon sx={{ fontSize: 16, color: "success.main" }} />
                                    ) : (
                                        <TrendingDownIcon sx={{ fontSize: 16, color: "error.main" }} />
                                    )}
                                    <Typography
                                        variant="caption"
                                        fontWeight={700}
                                        color={change >= 0 ? "success.main" : "error.main"}
                                    >
                                        {change >= 0 ? "+" : ""}{change}%
                                    </Typography>
                                </Stack>
                            )}
                        </Box>
                        <Box
                            sx={{
                                width: 44,
                                height: 44,
                                borderRadius: '12px',
                                bgcolor: iconBg,
                                color: iconColor,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                "& svg": { fontSize: 24 }
                            }}
                        >
                            {icon}
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </motion.div>
    );
}
