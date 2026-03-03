import IconButton from "@mui/material/IconButton";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { useUIStore } from "@/store";

export function ThemeToggle() {
    const { mode, toggleMode } = useUIStore();

    return (
        <IconButton onClick={toggleMode} size="small" title="Toggle theme">
            {mode === "dark" ? (
                <LightModeOutlinedIcon fontSize="small" />
            ) : (
                <DarkModeOutlinedIcon fontSize="small" />
            )}
        </IconButton>
    );
}
