import { IconButton, Tooltip } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useUIStore } from "../../store/ui.store";

export function ModeToggle() {
  const mode = useUIStore((s) => s.mode);
  const toggleMode = useUIStore((s) => s.toggleMode);

  return (
    <Tooltip title={mode === "dark" ? "Switch to light" : "Switch to dark"}>
      <IconButton onClick={toggleMode} aria-label="toggle theme mode">
        {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
}
