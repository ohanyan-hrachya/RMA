import { useState, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
    type GridColDef,
    type GridSortModel,
    type GridPaginationModel,
} from "@mui/x-data-grid";
import { useAuthStore } from "@/store";
import { usePermission } from "@/shared/hooks/use-permission";

import { AutoForm, AutoView, DataTable, PageHeader } from "@/shared/ui";
import type { CrudAction, CrudModuleConfig } from "@/shared/types";

// ─── Row Action Buttons  ─────────────────────────────────────────────────────

// ─── Row Action Buttons  ─────────────────────────────────────────────────────
// Rendered inside DataGrid cells — must NOT be a hook itself

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

function RowActions<T extends { id: number }>({
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

// ─── CrudModule ───────────────────────────────────────────────────────────────

export function CrudModule<T extends { id: number }>({
    config,
}: {
    config: CrudModuleConfig<T>;
}) {
    const qc = useQueryClient();
    const permissions = useAuthStore((s) => s.permissions);

    // ── Permissions ─────────────────────────────────────────────────────────
    const canCreate = usePermission(config.permissions?.create ?? "");
    const canUpdate = usePermission(config.permissions?.update ?? "");
    const canDelete = usePermission(config.permissions?.delete ?? "");
    const canView = usePermission(config.permissions?.view ?? "");

    // ── Pagination / Sort / Search state ────────────────────────────────────
    const [pagination, setPagination] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 10,
    });
    const [sortModel, setSortModel] = useState<GridSortModel>([]);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Debounce search 300ms
    const searchTimer = useMemo(() => ({ id: undefined as ReturnType<typeof setTimeout> | undefined }), []);
    const handleSearchChange = useCallback(
        (value: string) => {
            setSearch(value);
            if (searchTimer.id) clearTimeout(searchTimer.id);
            searchTimer.id = setTimeout(() => setDebouncedSearch(value), 300);
        },
        [searchTimer],
    );

    // ── Drawer / Dialog state ────────────────────────────────────────────────
    const [drawerMode, setDrawerMode] = useState<"create" | "edit" | "view" | null>(null);
    const [selectedRow, setSelectedRow] = useState<T | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<T | null>(null);

    // ── Query ─────────────────────────────────────────────────────────────
    const queryParams = useMemo(
        () => ({
            page: pagination.page,
            pageSize: pagination.pageSize,
            sortField: sortModel[0]?.field,
            sortOrder: sortModel[0]?.sort ?? undefined,
            search: debouncedSearch || undefined,
        }),
        [pagination, sortModel, debouncedSearch],
    );

    const { data, isLoading, isError } = useQuery({
        queryKey: [config.resource, "list", queryParams],
        queryFn: () => config.fetchList(queryParams as Parameters<typeof config.fetchList>[0]),
        placeholderData: (prev) => prev,
    });

    // ── Mutations ──────────────────────────────────────────────────────────
    const invalidate = () => qc.invalidateQueries({ queryKey: [config.resource] });

    const createMutation = useMutation({
        mutationFn: (d: Record<string, unknown>) => config.onCreate!(d),
        onSuccess: () => { invalidate(); setDrawerMode(null); },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) =>
            config.onUpdate!(id, data),
        onSuccess: () => { invalidate(); setDrawerMode(null); setSelectedRow(null); },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => config.onDelete!(id),
        onSuccess: () => { invalidate(); setDeleteTarget(null); },
    });

    // ── Handlers ──────────────────────────────────────────────────────────
    const openCreate = () => { setSelectedRow(null); setDrawerMode("create"); };
    const openEdit = (row: T) => { setSelectedRow(row); setDrawerMode("edit"); };
    const openView = (row: T) => { setSelectedRow(row); setDrawerMode("view"); };
    const closeDrawer = () => { setDrawerMode(null); setSelectedRow(null); };

    const handleFormSubmit = async (formData: Record<string, unknown>) => {
        if (drawerMode === "create") {
            await createMutation.mutateAsync(formData);
        } else if (drawerMode === "edit" && selectedRow) {
            await updateMutation.mutateAsync({ id: selectedRow.id, data: formData });
        }
    };

    // ── Columns with action column appended ────────────────────────────────
    const allColumns = useMemo<GridColDef[]>(
        () => [
            ...config.columns,
            {
                field: "__actions",
                headerName: "Actions",
                width: config.extraActions ? 180 : 130,
                sortable: false,
                renderCell: (params) => (
                    <RowActions
                        row={params.row as T}
                        canView={canView}
                        canUpdate={canUpdate}
                        canDelete={canDelete}
                        hasRenderView={!!config.renderView || !!config.viewSchema}
                        hasOnUpdate={!!config.onUpdate}
                        hasOnDelete={!!config.onDelete}
                        extraActions={config.extraActions ?? []}
                        permissions={permissions}
                        onView={openView}
                        onEdit={openEdit}
                        onDelete={setDeleteTarget}
                    />
                ),
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [config.columns, config.extraActions, canView, canUpdate, canDelete, permissions],
    );

    // ─────────────────────────────────────────────────────────────────────────

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* ── Header ──────────────────────────────────────────────────────── */}
            <PageHeader
                title={config.title}
                subtitle={data ? `${data.total.toLocaleString()} record${data.total !== 1 ? "s" : ""}` : undefined}
                search={search}
                onSearchChange={handleSearchChange}
                onAddClick={openCreate}
                canCreate={canCreate && !!config.onCreate}
            />

            {/* ── Error ───────────────────────────────────────────────────────── */}
            {isError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    Failed to load data. Please try again.
                </Alert>
            )}

            {/* ── Data Table ───────────────────────────────────────────────────── */}
            <DataTable
                rows={data?.data ?? []}
                columns={allColumns}
                total={data?.total ?? 0}
                isLoading={isLoading}
                pagination={pagination}
                onPaginationChange={setPagination}
                sortModel={sortModel}
                onSortChange={setSortModel}
            />

            {/* ── Create / Edit Drawer ────────────────────────────────────────── */}
            <Drawer
                anchor="right"
                open={drawerMode === "create" || drawerMode === "edit"}
                onClose={closeDrawer}
                PaperProps={{ sx: { width: { xs: "100%", sm: 480 } } }}
            >
                <Box p={3} display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6" fontWeight={700}>
                        {drawerMode === "create"
                            ? `Add ${config.title.replace(/s$/i, "")}`
                            : `Edit ${config.title.replace(/s$/i, "")}`}
                    </Typography>
                    <IconButton onClick={closeDrawer}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Divider />
                <Box p={3} flex={1} sx={{ overflowY: "auto" }}>
                    {config.renderForm ? (
                        config.renderForm({
                            mode: drawerMode as "create" | "edit",
                            initialData: drawerMode === "edit" ? (selectedRow ?? undefined) : undefined,
                            onSave: handleFormSubmit,
                            onClose: closeDrawer,
                            open: drawerMode !== null,
                            isSubmitting: createMutation.isPending || updateMutation.isPending,
                        })
                    ) : config.formSchema ? (
                        <AutoForm
                            schema={config.formSchema}
                            initialData={drawerMode === "edit" ? (selectedRow ?? undefined) : undefined}
                            onSubmit={handleFormSubmit}
                            onCancel={closeDrawer}
                            isSubmitting={createMutation.isPending || updateMutation.isPending}
                        />
                    ) : (
                        <Typography color="error">No form schema or renderer provided.</Typography>
                    )}
                </Box>
            </Drawer>

            {/* ── View Drawer ─────────────────────────────────────────────────── */}
            {config.renderView && (
                <Drawer
                    anchor="right"
                    open={drawerMode === "view"}
                    onClose={closeDrawer}
                    PaperProps={{ sx: { width: { xs: "100%", sm: 480 } } }}
                >
                    <Box p={3} display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6" fontWeight={700}>
                            Details
                        </Typography>
                        <IconButton onClick={closeDrawer}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Divider />
                    <Box p={3} sx={{ overflowY: "auto" }}>
                        {selectedRow && (
                            config.renderView ? (
                                config.renderView({
                                    open: drawerMode === "view",
                                    onClose: closeDrawer,
                                    data: selectedRow
                                })
                            ) : config.viewSchema ? (
                                <AutoView schema={config.viewSchema} data={selectedRow} />
                            ) : null
                        )}
                    </Box>
                </Drawer>
            )}

            {/* ── Delete Confirmation Dialog ───────────────────────────────────── */}
            <Dialog
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle fontWeight={700}>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography color="text.secondary">
                        This action cannot be undone. Are you sure you want to permanently
                        delete this record?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button
                        onClick={() => setDeleteTarget(null)}
                        variant="outlined"
                        disabled={deleteMutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
                        disabled={deleteMutation.isPending}
                    >
                        {deleteMutation.isPending ? "Deleting…" : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>
        </motion.div>
    );
}
