export interface User {
    id: number;
    name: string;
    email: string;
    role: "Admin" | "Manager" | "Viewer";
    status: "active" | "inactive" | "pending";
    createdAt: string;
}

export interface Job {
    id: number;
    title: string;
    department: string;
    location: string;
    type: "full-time" | "part-time" | "contract";
    status: "open" | "closed" | "draft";
    salary: number;
    postedAt: string;
}

export interface BankingApplication {
    id: number;
    applicantName: string;
    accountType: "Personal" | "Business" | "Corporate";
    amount: number;
    status: "pending" | "approved" | "review" | "rejected";
    risk: "low" | "medium" | "high";
    submittedAt: string;
}
