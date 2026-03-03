import { delay, paginate } from "@/shared/helpers";
import type { ListParams, PaginatedResponse } from "@/shared/types";
import { RESOURCE_MAP, users, jobs, banking, incrementUserId, incrementJobId, incrementBankingId } from "./data";

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
        if (resource === 'users') id = incrementUserId();
        else if (resource === 'jobs') id = incrementJobId();
        else id = incrementBankingId();

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
        const totalAmount = banking.reduce((sum, b) => sum + b.amount, 0);
        const approvedAmount = banking.filter(b => b.status === 'approved').reduce((sum, b) => sum + b.amount, 0);

        return {
            totalUsers: users.length,
            activeUsers: users.filter((u) => u.status === "active").length,
            openJobs: jobs.filter((j) => j.status === "open").length,
            pendingApplications: banking.filter((b) => b.status === "pending").length,
            approvalRate: Math.round((banking.filter((b) => b.status === "approved").length / Math.max(1, banking.length)) * 100),
            totalRevenue: totalAmount,
            revenueGrowth: 15,
            systemHealth: 98,
            recentActivity: [
                { month: "Jan", users: 4, applications: 1 },
                { month: "Feb", users: 5, applications: 3 },
                { month: "Mar", users: users.length, applications: banking.length }
            ],
            jobsByDept: [
                { name: "Engineering", value: jobs.filter(j => j.department === 'Engineering').length },
                { name: "Product", value: jobs.filter(j => j.department === 'Product').length },
                { name: "Design", value: jobs.filter(j => j.department === 'Design').length || 1 },
                { name: "Sales", value: 2 },
            ],
            revenueTrend: [
                { month: "Jan", amount: 120000 },
                { month: "Feb", amount: 150000 },
                { month: "Mar", amount: approvedAmount },
            ]
        };
    }
};
