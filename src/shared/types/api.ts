export interface ListParams {
    page: number;
    pageSize: number;
    sortField?: string;
    sortOrder?: "asc" | "desc";
    search?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
}
