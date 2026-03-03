import { useQuery } from "@tanstack/react-query";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { motion } from "framer-motion";
import { useConfigStore } from "@/store";
import { CrudModule } from "./CrudModule";
import { KpiCard, Widget, DataChart } from "@/shared/ui";
import { mockOverviewApi, mockGenericApi } from "@/services/mockApi";

export function ModuleEngine({ moduleId }: { moduleId: string }) {
    const { config } = useConfigStore();
    const moduleConfig = config?.modules.find((m) => m.id === moduleId);

    // Fetch dashboard data if needed
    const isDashboard = typeof moduleConfig?.layout !== "string" && moduleConfig?.layout?.type === "dashboard";
    const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
        queryKey: ["dashboard", moduleId],
        queryFn: () => moduleId === 'overview' ? mockOverviewApi.getStats() : Promise.resolve(null),
        enabled: isDashboard,
    });

    if (!moduleConfig) return null;

    const { layout } = moduleConfig;
    const layoutObj = typeof layout === "string" ? { type: layout, blocks: [] } : layout;
    const { type, blocks = [] } = layoutObj as any;

    // Handle CRUD layout
    if (type === "crud") {
        const { resource, columns, formSchema, viewSchema } = layout as any;

        // Use generic API if schema is provided
        if (resource && (formSchema || viewSchema)) {
            const genericConfig = {
                resource,
                title: moduleConfig.label,
                columns: columns || [],
                formSchema,
                viewSchema,
                fetchList: (params: any) => mockGenericApi.list(resource, params),
                onCreate: (data: any) => mockGenericApi.create(resource, data),
                onUpdate: (id: number, data: any) => mockGenericApi.update(resource, id, data),
                onDelete: (id: number) => mockGenericApi.delete(resource, id),
                permissions: {
                    list: `${resource}:list`,
                    create: `${resource}:create`,
                    update: `${resource}:update`,
                    delete: `${resource}:delete`,
                    view: `${resource}:view`,
                }
            };
            return <CrudModule config={genericConfig as any} />;
        }

        return (
            <Box p={3}>
                <Typography color="error">CRUD configuration for "{moduleId}" not found.</Typography>
            </Box>
        );
    }

    // Handle Dashboard layout
    if (type === "dashboard") {
        if (isDashboardLoading) {
            return (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                    <CircularProgress />
                </Box>
            );
        }

        return (
            <Box sx={{ width: "100%" }}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                    <Typography variant="h5" fontWeight={700} mb={3}>
                        {moduleConfig.label}
                    </Typography>
                </motion.div>

                <Grid container spacing={3}>
                    {/* Render Stats Blocks (KPIs) */}
                    <Grid size={12}>
                        <Grid container spacing={3}>
                            {blocks.filter((b: any) => b.type === 'stats').map((block: any, idx: number) => (
                                <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={idx}>
                                    <KpiCard
                                        title={block.title || "Metric"}
                                        value={dashboardData ? (dashboardData as any)[block.props?.dataKey || ''] : '—'}
                                        subtitle={block.props?.subtitle}
                                        resource={block.props?.resource}
                                        change={block.props?.change}
                                        delay={idx * 0.1}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>

                    {/* Render Content Blocks (Charts/Tables) */}
                    {blocks.filter((b: any) => b.type !== 'stats').map((block: any, idx: number) => (
                        <Grid
                            size={{
                                xs: 12,
                                lg: block.position === 'full' ? 12 : block.position === 'side' ? 4 : 8
                            }}
                            key={idx}
                        >
                            <Widget title={block.title || "Widget"} delay={0.3 + idx * 0.1}>
                                {block.type === 'chart' && dashboardData && (
                                    <DataChart
                                        type={block.props?.chartType || 'area'}
                                        data={(dashboardData as any)[block.props?.dataKey || ''] || []}
                                        hideAxes={block.position === 'side'}
                                    />
                                )}
                            </Widget>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Typography>Module "{moduleId}" engine in progress...</Typography>
        </Box>
    );
}
