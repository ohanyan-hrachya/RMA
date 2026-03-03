import type {
    User, Job, BankingApplication,
    FormFieldSchema, ViewFieldSchema, ModuleAppConfig, AppConfig, ShellConfig,
    ListParams, PaginatedResponse
} from "../shared/types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

let userIdSeq = 50;
let jobIdSeq = 20;
let bankingIdSeq = 15;

function paginate<T extends Record<string, any>>(
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

// ─── In-Memory Data ──────────────────────────────────────────────────────────

const users: User[] = [
    { id: 1, name: "Alice Martin", email: "alice@rma.dev", role: "Admin", status: "active", createdAt: "2024-01-15T10:00:00Z" },
    { id: 2, name: "Bob Chen", email: "bob@rma.dev", role: "Manager", status: "active", createdAt: "2024-02-20T09:30:00Z" },
    { id: 3, name: "Carol Smith", email: "carol@rma.dev", role: "Viewer", status: "inactive", createdAt: "2024-03-05T14:00:00Z" },
    { id: 4, name: "David Kim", email: "david@rma.dev", role: "Manager", status: "active", createdAt: "2024-03-12T11:45:00Z" },
    { id: 5, name: "Eva Novak", email: "eva@rma.dev", role: "Viewer", status: "pending", createdAt: "2024-04-01T08:00:00Z" },
    { id: 6, name: "Frank Lee", email: "frank@rma.dev", role: "Admin", status: "active", createdAt: "2024-04-10T16:00:00Z" },
];

const jobs: Job[] = [
    { id: 1, title: "Senior Frontend Engineer", department: "Engineering", location: "Remote", type: "full-time", status: "open", salary: 120000, postedAt: "2024-01-10T10:00:00Z" },
    { id: 2, title: "Product Manager", department: "Product", location: "New York, NY", type: "full-time", status: "open", salary: 140000, postedAt: "2024-01-20T09:00:00Z" },
];

const banking: BankingApplication[] = [
    { id: 1, applicantName: "Marcus Reed", accountType: "Business", amount: 250000, status: "pending", risk: "low", submittedAt: "2024-01-08T10:00:00Z" },
    { id: 2, applicantName: "Sophia Lane", accountType: "Personal", amount: 15000, status: "approved", risk: "low", submittedAt: "2024-01-15T09:00:00Z" },
];

// ─── Generic API Implementation ──────────────────────────────────────────────

const RESOURCE_MAP: Record<string, any[]> = {
    users,
    jobs,
    banking,
};

export const mockGenericApi = {
    list: async (resource: string, params: ListParams): Promise<PaginatedResponse<any>> => {
        await delay();
        const items = RESOURCE_MAP[resource] || [];
        return paginate(items, params);
    },

    create: async (resource: string, dto: any): Promise<any> => {
        await delay(600);
        const items = RESOURCE_MAP[resource];
        if (!items) throw new Error("Resource not found");

        let id;
        if (resource === 'users') id = ++userIdSeq;
        else if (resource === 'jobs') id = ++jobIdSeq;
        else id = ++bankingIdSeq;

        const newItem = { id, ...dto, status: "active", createdAt: new Date().toISOString(), submittedAt: new Date().toISOString(), postedAt: new Date().toISOString() };
        items.unshift(newItem);
        return newItem;
    },

    update: async (resource: string, id: number, dto: any): Promise<any> => {
        await delay(500);
        const items = RESOURCE_MAP[resource];
        const idx = items?.findIndex((i) => i.id === id);
        if (idx === -1 || !items) throw { status: 404, message: "Not found" };
        items[idx] = { ...items[idx], ...dto };
        return items[idx];
    },

    delete: async (resource: string, id: number): Promise<void> => {
        await delay(400);
        const items = RESOURCE_MAP[resource];
        const idx = items?.findIndex((i) => i.id === id);
        if (idx !== -1 && items) items.splice(idx, 1);
    },
};

// ─── Legacy APIs (Keeping exports for compatibility during refactor) ────────

export const mockUsersApi = {
    list: (params: ListParams) => mockGenericApi.list('users', params),
    create: (dto: any) => mockGenericApi.create('users', dto),
    update: (id: number, dto: any) => mockGenericApi.update('users', id, dto),
    delete: (id: number) => mockGenericApi.delete('users', id),
};

export const mockJobsApi = {
    list: (params: ListParams) => mockGenericApi.list('jobs', params),
    create: (dto: any) => mockGenericApi.create('jobs', dto),
    update: (id: number, dto: any) => mockGenericApi.update('jobs', id, dto),
    delete: (id: number) => mockGenericApi.delete('jobs', id),
};

export const mockBankingApi = {
    list: (params: ListParams) => mockGenericApi.list('banking', params),
    create: (dto: any) => mockGenericApi.create('banking', dto),
    update: (id: number, dto: any) => mockGenericApi.update('banking', id, dto),
    delete: (id: number) => mockGenericApi.delete('banking', id),
};

export const mockOverviewApi = {
    getStats: async () => {
        await delay(500);
        return {
            totalUsers: users.length,
            activeUsers: users.filter((u) => u.status === "active").length,
            openJobs: jobs.filter((j) => j.status === "open").length,
            pendingApplications: banking.filter((b) => b.status === "pending").length,
            approvalRate: Math.round((banking.filter((b) => b.status === "approved").length / Math.max(1, banking.length)) * 100),
            recentActivity: [{ month: "Mar", users: users.length, applications: banking.length }],
            jobsByDept: [{ name: "Engineering", value: jobs.filter(j => j.department === 'Engineering').length }],
        };
    }
};

// ─── App Configuration ───────────────────────────────────────────────────────

export const APP_CONFIG: AppConfig = {
    settings: {
        brandName: "RMA Admin",
        logoText: "R",
    },
    shells: {
        default: { id: "default", showSidebar: true, showTopbar: true, sidebarPosition: "left", sidebarCollapsible: true },
        compact: { id: "compact", showSidebar: false, showTopbar: true, sidebarPosition: "left", sidebarCollapsible: false }
    },
    modules: [
        {
            id: "overview",
            label: "Overview",
            path: "/",
            icon: "Dashboard",
            permission: "overview:view",
            shellId: "default",
            layout: {
                type: "dashboard",
                blocks: [
                    { type: "stats", position: "full", title: "Total Users", props: { dataKey: "totalUsers", resource: "users" } },
                    { type: "chart", position: "main", title: "Activity", props: { chartType: "area", dataKey: "recentActivity" } },
                ]
            },
        },
        {
            id: "users",
            label: "Users",
            path: "/users",
            icon: "People",
            permission: "users:list",
            shellId: "default",
            layout: {
                type: "crud",
                resource: "users",
                columns: [
                    { field: "id", headerName: "ID", width: 70 },
                    { field: "name", headerName: "Full Name", flex: 1 },
                    { field: "email", headerName: "Email", flex: 1 },
                    { field: "role", headerName: "Role", width: 120 },
                    { field: "status", headerName: "Status", width: 120 },
                ],
                formSchema: [
                    { name: "name", label: "Full Name", type: "text", required: true },
                    { name: "email", label: "Email Address", type: "email", required: true },
                    {
                        name: "role", label: "Role", type: "select", options: [
                            { label: "Admin", value: "Admin" }, { label: "Manager", value: "Manager" }, { label: "Viewer", value: "Viewer" }
                        ]
                    },
                ],
                viewSchema: [
                    { name: "name", label: "Name" },
                    { name: "email", label: "Email" },
                    { name: "role", label: "Role", type: "chip", colorMap: { Admin: "error", Manager: "primary", Viewer: "default" } },
                    { name: "createdAt", label: "Joined At", type: "date" },
                ]
            }
        },
        {
            id: "jobs",
            label: "Jobs",
            path: "/jobs",
            icon: "Work",
            permission: "jobs:list",
            shellId: "default",
            layout: {
                type: "crud",
                resource: "jobs",
                columns: [
                    { field: "title", headerName: "Job Title", flex: 1 },
                    { field: "department", headerName: "Department", width: 150 },
                    { field: "salary", headerName: "Salary", width: 120 },
                    { field: "status", headerName: "Status", width: 120 },
                ],
                formSchema: [
                    { name: "title", label: "Job Title", type: "text", required: true },
                    {
                        name: "department", label: "Department", type: "select", options: [
                            { label: "Engineering", value: "Engineering" }, { label: "Product", value: "Product" }, { label: "Design", value: "Design" }
                        ]
                    },
                    { name: "salary", label: "Yearly Salary", type: "number" },
                ],
                viewSchema: [
                    { name: "title", label: "Title" },
                    { name: "department", label: "Dept" },
                    { name: "salary", label: "Salary", type: "currency" },
                    { name: "status", label: "Status", type: "chip" },
                ]
            }
        },
        {
            id: "banking",
            label: "Banking",
            path: "/banking",
            icon: "AccountBalance",
            permission: "banking:list",
            shellId: "compact",
            layout: {
                type: "crud",
                resource: "banking",
                columns: [
                    { field: "applicantName", headerName: "Applicant", flex: 1 },
                    { field: "accountType", headerName: "Type", width: 130 },
                    { field: "amount", headerName: "Amount", width: 130, type: "number" },
                    { field: "status", headerName: "Status", width: 120 },
                ],
                formSchema: [
                    { name: "applicantName", label: "Applicant Name", type: "text", required: true },
                    {
                        name: "accountType", label: "Account Type", type: "select", options: [
                            { label: "Personal", value: "Personal" }, { label: "Business", value: "Business" }, { label: "Corporate", value: "Corporate" }
                        ]
                    },
                    { name: "amount", label: "Requested Amount", type: "number", required: true },
                ],
                viewSchema: [
                    { name: "applicantName", label: "Applicant" },
                    { name: "accountType", label: "Type" },
                    { name: "amount", label: "Amount", type: "currency" },
                    { name: "status", label: "Status", type: "chip", colorMap: { approved: "success", rejected: "error", review: "warning", pending: "info" } },
                    { name: "submittedAt", label: "Submitted At", type: "date" },
                ]
            }
        },
    ]
};

export const mockConfigApi = {
    getAppConfig: async () => {
        await delay(300);
        return APP_CONFIG;
    }
};
