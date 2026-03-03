import type { AppConfig } from "@/shared/types";

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
                    { type: "stats", position: "full", title: "Total Users", props: { dataKey: "totalUsers", resource: "users", change: 12 } },
                    { type: "stats", position: "full", title: "Active Users", props: { dataKey: "activeUsers", subtitle: "Currently active" } },
                    { type: "stats", position: "full", title: "Open Jobs", props: { dataKey: "openJobs", resource: "jobs", change: -5 } },
                    { type: "stats", position: "full", title: "Applications", props: { dataKey: "pendingApplications", resource: "banking", subtitle: "Pending review" } },
                    { type: "chart", position: "main", title: "User & Application Growth", props: { chartType: "area", dataKey: "recentActivity" } },
                    { type: "chart", position: "side", title: "Department Distribution", props: { chartType: "pie", dataKey: "jobsByDept" } },
                    { type: "chart", position: "full", title: "Revenue Trend ($)", props: { chartType: "bar", dataKey: "revenueTrend" } },
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
