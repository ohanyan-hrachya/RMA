import type { ReactNode } from "react";
import type { GridColDef } from "@mui/x-data-grid";
import type { FormFieldSchema, ViewFieldSchema } from "./schema";

export interface CrudAction<T> {
    label: string;
    icon?: ReactNode;
    permission?: string;
    show?: (row: T) => boolean;
    onClick: (row: T) => void; // Fixed: now accepts row as argument
    color?: "primary" | "error" | "warning" | "success" | "inherit" | "default" | "secondary";
}

export interface CrudModuleConfig<T extends { id: number }> {
    resource: string;
    title: string;
    columns: GridColDef[];
    fetchList: (params: {
        page: number;
        pageSize: number;
        sortField?: string;
        sortOrder?: "asc" | "desc";
        search?: string;
    }) => Promise<{ data: T[]; total: number }>;
    onCreate?: (data: Record<string, unknown>) => Promise<T>;
    onUpdate?: (id: number, data: Record<string, unknown>) => Promise<T>;
    onDelete?: (id: number) => Promise<void>;
    // Generic Schemas
    formSchema?: FormFieldSchema[];
    viewSchema?: ViewFieldSchema[];
    // Permissions
    permissions?: {
        list?: string;
        create?: string;
        update?: string;
        delete?: string;
        view?: string;
    };
    // Custom Actions
    extraActions?: CrudAction<T>[];
    // Custom Overrides
    renderForm?: (props: {
        mode: "create" | "edit";
        open: boolean;
        onClose: () => void;
        initialData?: T;
        onSave: (data: any) => Promise<void>;
        isSubmitting: boolean;
    }) => ReactNode;
    renderView?: (props: {
        open: boolean;
        onClose: () => void;
        data: T;
    }) => ReactNode;
}
