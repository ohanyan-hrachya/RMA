import { } from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import {
    DataGrid,
    type GridColDef,
    type GridSortModel,
    type GridPaginationModel,
} from "@mui/x-data-grid";

interface DataTableProps<T> {
    rows: T[];
    columns: GridColDef[];
    total: number;
    isLoading?: boolean;
    pagination: GridPaginationModel;
    onPaginationChange: (model: GridPaginationModel) => void;
    sortModel: GridSortModel;
    onSortChange: (model: GridSortModel) => void;
}

export function DataTable<T extends { id: number }>({
    rows,
    columns,
    total,
    isLoading,
    pagination,
    onPaginationChange,
    sortModel,
    onSortChange,
}: DataTableProps<T>) {
    return (
        <Box
            sx={{
                bgcolor: "background.paper",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                overflow: "hidden",
            }}
        >
            {isLoading ? (
                <Box p={2}>
                    {Array.from({ length: 7 }).map((_, i) => (
                        <Skeleton key={i} height={52} sx={{ mb: 0.5, borderRadius: 1 }} />
                    ))}
                </Box>
            ) : (
                <DataGrid
                    rows={rows}
                    columns={columns}
                    rowCount={total}
                    paginationMode="server"
                    sortingMode="server"
                    paginationModel={pagination}
                    onPaginationModelChange={onPaginationChange}
                    sortModel={sortModel}
                    onSortModelChange={onSortChange}
                    pageSizeOptions={[5, 10, 25]}
                    disableRowSelectionOnClick
                    autoHeight
                    sx={{
                        border: "none",
                        "& .MuiDataGrid-columnHeaders": {
                            bgcolor: "action.hover",
                        },
                        "& .MuiDataGrid-columnHeader": {
                            fontWeight: 700,
                        },
                        "& .MuiDataGrid-row:hover": { bgcolor: "action.hover" },
                        "& .MuiDataGrid-cell": { borderColor: "divider" },
                        "& .MuiDataGrid-footerContainer": { borderColor: "divider" },
                    }}
                />
            )}
        </Box>
    );
}
