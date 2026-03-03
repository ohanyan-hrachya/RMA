import { useMemo } from "react";
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
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import CloseIcon from "@mui/icons-material/Close";
import { type GridColDef, type GridCellParams } from "@mui/x-data-grid";

import { AutoForm, DataTable, PageHeader } from "@/shared/ui";
import type { CrudModuleConfig } from "@/shared/types";

import { RowActions } from "./components/RowActions";
import { useCrudModule } from "./hooks/useCrudModule";

export function CrudModule<T extends { id: number }>({
    config,
}: {
    config: CrudModuleConfig<T>;
}) {
    const {
        permissions,
        table,
        search,
        drawer,
        mutations,
        deleteDialog,
        handleFormSubmit,
    } = useCrudModule(config);

    const { data, isLoading, isError } = table.queryResult;

    // Columns with action column appended
    const allColumns = useMemo<GridColDef[]>(
        () => [
            ...config.columns,
            {
                field: "__actions",
                headerName: "Actions",
                width: config.extraActions ? 180 : 130,
                sortable: false,
                renderCell: (params: GridCellParams<T>) => (
                    <RowActions
                        row={params.row as T}
                        canView={permissions.canView}
                        canUpdate={permissions.canUpdate}
                        canDelete={permissions.canDelete}
                        hasRenderView={!!config.renderView || !!config.viewSchema}
                        hasOnUpdate={!!config.onUpdate}
                        hasOnDelete={!!config.onDelete}
                        extraActions={config.extraActions ?? []}
                        permissions={permissions.all}
                        onView={drawer.openView}
                        onEdit={drawer.openEdit}
                        onDelete={deleteDialog.setTarget}
                    />
                ),
            },
        ],
        [config.columns, config.extraActions, permissions, drawer.openView, drawer.openEdit, deleteDialog.setTarget, config.renderView, config.viewSchema, config.onUpdate, config.onDelete],
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <PageHeader
                title={config.title}
                subtitle={data ? `${data.total.toLocaleString()} record${data.total !== 1 ? "s" : ""}` : undefined}
                search={search.value}
                onSearchChange={search.handleSearchChange}
                onAddClick={drawer.openCreate}
                canCreate={permissions.canCreate && !!config.onCreate}
            />

            {isError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    Failed to load data. Please try again.
                </Alert>
            )}

            <DataTable
                rows={data?.data ?? []}
                columns={allColumns}
                total={data?.total ?? 0}
                isLoading={isLoading}
                pagination={table.pagination}
                onPaginationChange={table.setPagination}
                sortModel={table.sortModel}
                onSortChange={table.setSortModel}
            />

            <Drawer
                anchor="right"
                open={drawer.mode === "create" || drawer.mode === "edit"}
                onClose={drawer.closeDrawer}
                PaperProps={{ sx: { width: { xs: "100%", sm: 480 } } }}
            >
                <Box p={3} display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6" fontWeight={700}>
                        {drawer.mode === "create"
                            ? `Add ${config.title.replace(/s$/i, "")}`
                            : `Edit ${config.title.replace(/s$/i, "")}`}
                    </Typography>
                    <IconButton onClick={drawer.closeDrawer}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Divider />
                <Box p={3} flex={1} sx={{ overflowY: "auto" }}>
                    {config.renderForm ? (
                        config.renderForm({
                            mode: drawer.mode as "create" | "edit",
                            initialData: drawer.mode === "edit" ? (drawer.selectedRow ?? undefined) : undefined,
                            onSave: handleFormSubmit,
                            onClose: drawer.closeDrawer,
                            open: drawer.mode !== null,
                            isSubmitting: mutations.create.isPending || mutations.update.isPending,
                        })
                    ) : config.formSchema ? (
                        <AutoForm
                            schema={config.formSchema}
                            initialData={drawer.mode === "edit" ? (drawer.selectedRow ?? undefined) : undefined}
                            onSubmit={handleFormSubmit}
                            onCancel={drawer.closeDrawer}
                            isSubmitting={mutations.create.isPending || mutations.update.isPending}
                        />
                    ) : (
                        <Typography color="error">No form schema or renderer provided.</Typography>
                    )}
                </Box>
            </Drawer>

            {config.renderView && (
                <Drawer
                    anchor="right"
                    open={drawer.mode === "view"}
                    onClose={drawer.closeDrawer}
                    PaperProps={{ sx: { width: { xs: "100%", sm: 480 } } }}
                >
                    <Box p={3} display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6" fontWeight={700}>Details</Typography>
                        <IconButton onClick={drawer.closeDrawer}><CloseIcon /></IconButton>
                    </Box>
                    <Divider />
                    <Box p={3} sx={{ overflowY: "auto" }}>
                        {drawer.selectedRow && (
                            config.renderView({
                                open: drawer.mode === "view",
                                onClose: drawer.closeDrawer,
                                data: drawer.selectedRow
                            })
                        )}
                    </Box>
                </Drawer>
            )}

            <Dialog
                open={!!deleteDialog.target}
                onClose={() => deleteDialog.setTarget(null)}
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
                        onClick={() => deleteDialog.setTarget(null)}
                        variant="outlined"
                        disabled={mutations.delete.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => deleteDialog.target && mutations.delete.mutate(deleteDialog.target.id)}
                        disabled={mutations.delete.isPending}
                    >
                        {mutations.delete.isPending ? "Deleting…" : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>
        </motion.div>
    );
}
