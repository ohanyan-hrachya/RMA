import type { ListParams, PaginatedResponse } from "@/shared/types";

export const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export function paginate<T extends Record<string, any>>(
    items: T[],
    params: ListParams,
): PaginatedResponse<T> {
    let filtered = items;

    if (params.search) {
        const q = params.search.toLowerCase();
        filtered = items.filter((item) =>
            Object.values(item).some((v) =>
                String(v).toLowerCase().includes(q),
            ),
        );
    }

    if (params.sortField) {
        filtered = [...filtered].sort((a, b) => {
            const aVal = a[params.sortField!];
            const bVal = b[params.sortField!];
            const cmp = String(aVal).localeCompare(String(bVal), undefined, {
                numeric: true,
            });
            return params.sortOrder === "desc" ? -cmp : cmp;
        });
    }

    const start = params.page * params.pageSize;
    return {
        data: filtered.slice(start, start + params.pageSize) as T[],
        total: filtered.length,
    };
}
