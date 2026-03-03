import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import type { ViewFieldSchema } from "../types";

interface AutoViewProps {
    schema: ViewFieldSchema[];
    data: Record<string, any>;
}

export function AutoView({ schema, data }: AutoViewProps) {
    const renderValue = (field: ViewFieldSchema) => {
        const value = data[field.name];

        if (value === undefined || value === null) return "—";

        switch (field.type) {
            case "chip":
                return (
                    <Chip
                        label={String(value)}
                        size="small"
                        color={field.colorMap?.[String(value)] || "default"}
                        variant="outlined"
                    />
                );
            case "currency":
                return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value));
            case "date":
                return new Date(value).toLocaleDateString();
            case "boolean":
                return value ? "Yes" : "No";
            default:
                return String(value);
        }
    };

    return (
        <Stack spacing={2.5}>
            {schema.map((field) => (
                <Box key={field.name}>
                    <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
                        {field.label}
                    </Typography>
                    <Box mt={0.5}>
                        {typeof renderValue(field) === "string" ? (
                            <Typography variant="body1" fontWeight={500}>
                                {renderValue(field)}
                            </Typography>
                        ) : (
                            renderValue(field)
                        )}
                    </Box>
                    <Divider sx={{ mt: 1.5, opacity: 0.5 }} />
                </Box>
            ))}
        </Stack>
    );
}
