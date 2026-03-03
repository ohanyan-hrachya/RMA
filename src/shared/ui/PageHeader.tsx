import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    search?: string;
    onSearchChange?: (value: string) => void;
    onAddClick?: () => void;
    addLabel?: string;
    canCreate?: boolean;
    extraActions?: React.ReactNode;
}

export function PageHeader({
    title,
    subtitle,
    search,
    onSearchChange,
    onAddClick,
    addLabel,
    canCreate,
    extraActions
}: PageHeaderProps) {
    return (
        <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ sm: "center" }}
            justifyContent="space-between"
            spacing={2}
            mb={3}
        >
            <Box>
                <Typography variant="h5" fontWeight={700}>
                    {title}
                </Typography>
                {subtitle && (
                    <Typography variant="body2" color="text.secondary">
                        {subtitle}
                    </Typography>
                )}
            </Box>
            <Stack direction="row" spacing={1.5} alignItems="center">
                {onSearchChange && (
                    <TextField
                        size="small"
                        placeholder={`Search ${title.toLowerCase()}…`}
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" color="action" />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={{ width: { xs: "100%", sm: 240 } }}
                    />
                )}
                {extraActions}
                {canCreate && onAddClick && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={onAddClick}
                        sx={{ whiteSpace: "nowrap" }}
                    >
                        {addLabel || `Add ${title.replace(/s$/i, "")}`}
                    </Button>
                )}
            </Stack>
        </Stack>
    );
}
