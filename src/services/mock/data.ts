import type { User, Job, BankingApplication } from "@/shared/types";

export let userIdSeq = 50;
export let jobIdSeq = 20;
export let bankingIdSeq = 15;

export const users: User[] = [
    { id: 1, name: "Alice Martin", email: "alice@rma.dev", role: "Admin", status: "active", createdAt: "2024-01-15T10:00:00Z" },
    { id: 2, name: "Bob Chen", email: "bob@rma.dev", role: "Manager", status: "active", createdAt: "2024-02-20T09:30:00Z" },
    { id: 3, name: "Carol Smith", email: "carol@rma.dev", role: "Viewer", status: "inactive", createdAt: "2024-03-05T14:00:00Z" },
    { id: 4, name: "David Kim", email: "david@rma.dev", role: "Manager", status: "active", createdAt: "2024-03-12T11:45:00Z" },
    { id: 5, name: "Eva Novak", email: "eva@rma.dev", role: "Viewer", status: "pending", createdAt: "2024-04-01T08:00:00Z" },
    { id: 6, name: "Frank Lee", email: "frank@rma.dev", role: "Admin", status: "active", createdAt: "2024-04-10T16:00:00Z" },
];

export const jobs: Job[] = [
    { id: 1, title: "Senior Frontend Engineer", department: "Engineering", location: "Remote", type: "full-time", status: "open", salary: 120000, postedAt: "2024-01-10T10:00:00Z" },
    { id: 2, title: "Product Manager", department: "Product", location: "New York, NY", type: "full-time", status: "open", salary: 140000, postedAt: "2024-01-20T09:00:00Z" },
];

export const banking: BankingApplication[] = [
    { id: 1, applicantName: "Marcus Reed", accountType: "Business", amount: 250000, status: "pending", risk: "low", submittedAt: "2024-01-08T10:00:00Z" },
    { id: 2, applicantName: "Sophia Lane", accountType: "Personal", amount: 15000, status: "approved", risk: "low", submittedAt: "2024-01-15T09:00:00Z" },
];

export const RESOURCE_MAP: Record<string, any[]> = {
    users,
    jobs,
    banking,
};

export const incrementUserId = () => ++userIdSeq;
export const incrementJobId = () => ++jobIdSeq;
export const incrementBankingId = () => ++bankingIdSeq;
