import { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { useAuthStore } from "@/store";
import { usePermission } from "@/shared/hooks/use-permission";
import type { CrudModuleConfig } from "@/shared/types";

export function useCrudModule<T extends { id: number }>(config: CrudModuleConfig<T>) {
    const qc = useQueryClient();
    const permissions = useAuthStore((s) => s.permissions);

    // Permissions
    const canCreate = usePermission(config.permissions?.create ?? "");
    const canUpdate = usePermission(config.permissions?.update ?? "");
    const canDelete = usePermission(config.permissions?.delete ?? "");
    const canView = usePermission(config.permissions?.view ?? "");

    // State
    const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
    const [sortModel, setSortModel] = useState<GridSortModel>([]);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [drawerMode, setDrawerMode] = useState<"create" | "edit" | "view" | null>(null);
    const [selectedRow, setSelectedRow] = useState<T | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<T | null>(null);

    // Search debounce logic
    const searchTimer = useMemo(() => ({ id: undefined as ReturnType<typeof setTimeout> | undefined }), []);
    const handleSearchChange = useCallback((value: string) => {
        setSearch(value);
        if (searchTimer.id) clearTimeout(searchTimer.id);
        searchTimer.id = setTimeout(() => setDebouncedSearch(value), 300);
    }, [searchTimer]);

    // Query
    const queryParams = useMemo(() => ({
        page: pagination.page,
        pageSize: pagination.pageSize,
        sortField: sortModel[0]?.field,
        sortOrder: sortModel[0]?.sort ?? undefined,
        search: debouncedSearch || undefined,
    }), [pagination, sortModel, debouncedSearch]);

    const queryResult = useQuery({
        queryKey: [config.resource, "list", queryParams],
        queryFn: () => config.fetchList(queryParams as Parameters<typeof config.fetchList>[0]),
        placeholderData: (prev) => prev,
    });

    // Mutations
    const invalidate = () => qc.invalidateQueries({ queryKey: [config.resource] });

    const createMutation = useMutation({
        mutationFn: (d: Record<string, unknown>) => config.onCreate!(d),
        onSuccess: () => { invalidate(); setDrawerMode(null); },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) => config.onUpdate!(id, data),
        onSuccess: () => { invalidate(); setDrawerMode(null); setSelectedRow(null); },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => config.onDelete!(id),
        onSuccess: () => { invalidate(); setDeleteTarget(null); },
    });

    // Handlers
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

    return {
        permissions: { canCreate, canUpdate, canDelete, canView, all: permissions },
        table: { pagination, setPagination, sortModel, setSortModel, queryResult },
        search: { value: search, handleSearchChange },
        drawer: { mode: drawerMode, selectedRow, openCreate, openEdit, openView, closeDrawer },
        mutations: { create: createMutation, update: updateMutation, delete: deleteMutation },
        deleteDialog: { target: deleteTarget, setTarget: setDeleteTarget },
        handleFormSubmit,
    };
}
