import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useConfigStore } from "@/store";

interface LogoProps {
    collapsed?: boolean;
    showText?: boolean;
}

export function Logo({ collapsed, showText = true }: LogoProps) {
    const { config } = useConfigStore();

    return (
        <Stack direction="row" alignItems="center" spacing={1.5}>
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
                    fontSize: 16,
                    boxShadow: (theme) => `0 4px 12px ${theme.palette.primary.main}40`,
                }}
            >
                {config?.settings.logoText || "R"}
            </Box>
            {!collapsed && showText && (
                <Typography
                    variant="subtitle1"
                    fontWeight={800}
                    letterSpacing="-0.02em"
                    color="text.primary"
                    sx={{ lineHeight: 1 }}
                >
                    {config?.settings.brandName || "RMA Manager"}
                </Typography>
            )}
        </Stack>
    );
}
