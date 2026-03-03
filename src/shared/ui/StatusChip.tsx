import Chip from "@mui/material/Chip";

type StatusVariant =
    // User statuses
    | "active"
    | "inactive"
    | "pending"
    // Job statuses
    | "open"
    | "closed"
    | "draft"
    // Banking statuses
    | "approved"
    | "rejected"
    | "review"
    // Risk levels
    | "low"
    | "medium"
    | "high";

interface StatusChipProps {
    status: StatusVariant | string;
    size?: "small" | "medium";
}

const STATUS_CONFIG: Record<
    string,
    { label: string; color: "success" | "error" | "warning" | "info" | "default" }
> = {
    active: { label: "Active", color: "success" },
    inactive: { label: "Inactive", color: "default" },
    pending: { label: "Pending", color: "warning" },
    open: { label: "Open", color: "success" },
    closed: { label: "Closed", color: "error" },
    draft: { label: "Draft", color: "default" },
    approved: { label: "Approved", color: "success" },
    rejected: { label: "Rejected", color: "error" },
    review: { label: "In Review", color: "info" },
    low: { label: "Low", color: "success" },
    medium: { label: "Medium", color: "warning" },
    high: { label: "High", color: "error" },
};

export function StatusChip({ status, size = "small" }: StatusChipProps) {
    const cfg = STATUS_CONFIG[typeof status === 'string' ? status.toLowerCase() : status] ?? { label: status, color: "default" as const };

    return (
        <Chip
            label={cfg.label}
            color={cfg.color}
            size={size}
            variant="filled"
            sx={{
                fontWeight: 700,
                fontSize: "0.7rem",
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                borderRadius: '6px',
                height: 24,
                // Ensure text is white/slate-100 on these colored chips
                color: "#F1F5F9"
            }}
        />
    );
}
