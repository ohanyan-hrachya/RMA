import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import type { CrudAction } from "@/shared/types";

interface RowActionsProps<T extends { id: number }> {
    row: T;
    canView: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    hasRenderView: boolean;
    hasOnUpdate: boolean;
    hasOnDelete: boolean;
    extraActions: CrudAction<T>[];
    permissions: Set<string>;
    onView: (row: T) => void;
    onEdit: (row: T) => void;
    onDelete: (row: T) => void;
}

export function RowActions<T extends { id: number }>({
    row,
    canView,
    canUpdate,
    canDelete,
    hasRenderView,
    hasOnUpdate,
    hasOnDelete,
    extraActions,
    permissions,
    onView,
    onEdit,
    onDelete,
}: RowActionsProps<T>) {
    return (
        <Stack direction="row" spacing={0.5} alignItems="center" height="100%">
            {canView && hasRenderView && (
                <IconButton size="small" onClick={() => onView(row)} title="View">
                    <VisibilityOutlinedIcon fontSize="small" />
                </IconButton>
            )}
            {canUpdate && hasOnUpdate && (
                <IconButton size="small" onClick={() => onEdit(row)} title="Edit">
                    <EditOutlinedIcon fontSize="small" />
                </IconButton>
            )}
            {canDelete && hasOnDelete && (
                <IconButton
                    size="small"
                    color="error"
                    onClick={() => onDelete(row)}
                    title="Delete"
                >
                    <DeleteOutlineIcon fontSize="small" />
                </IconButton>
            )}
            {extraActions
                .filter((a) => {
                    if (a.show && !a.show(row)) return false;
                    if (a.permission && !permissions.has(a.permission)) return false;
                    return true;
                })
                .map((a, i) => (
                    <IconButton
                        key={i}
                        size="small"
                        color={a.color as "primary" | "error" | "warning" | "success" | "secondary" | "inherit" | undefined}
                        onClick={() => a.onClick(row)}
                        title={a.label}
                    >
                        {a.icon}
                    </IconButton>
                ))}
        </Stack>
    );
}
