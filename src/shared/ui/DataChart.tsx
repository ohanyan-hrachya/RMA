import Box from "@mui/material/Box";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

const PIE_COLORS = ["#2563EB", "#7C3AED", "#059669", "#D97706", "#DC2626", "#0891B2"];

interface DataChartProps {
    type: "area" | "pie";
    data: any[];
    height?: number | string;
    hideAxes?: boolean;
}

export function DataChart({ type, data, height = 260, hideAxes }: DataChartProps) {
    if (!data || data.length === 0) return null;

    return (
        <Box sx={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                {type === 'pie' ? (
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%" cy="50%" innerRadius={60} outerRadius={80}
                            paddingAngle={5} dataKey="value"
                        >
                            {data.map((_: any, i: number) => (
                                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                            ))}
                        </Pie>
                        <ChartTooltip />
                        <Legend />
                    </PieChart>
                ) : (
                    <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                        <XAxis dataKey="month" hide={hideAxes} />
                        <YAxis hide={hideAxes} />
                        <ChartTooltip />
                        <Area type="monotone" dataKey="users" stroke="#2563EB" fill="#2563EB" fillOpacity={0.1} />
                        <Area type="monotone" dataKey="applications" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.1} />
                    </AreaChart>
                )}
            </ResponsiveContainer>
        </Box>
    );
}
